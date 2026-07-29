import React, { useState, useEffect } from 'react';
import { db, auth } from './lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Project, Certification, ContactMessage, BlogPost } from './types';
import { INITIAL_PROJECTS, INITIAL_CERTIFICATIONS, INITIAL_POSTS } from './lib/seedData';

import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SEO } from './components/SEO';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Certifications } from './components/Certifications';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminPanel } from './components/Admin/AdminPanel';
import { GeminiChatbot } from './components/GeminiChatbot';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'projects' | 'certifications' | 'blog' | 'messages' | 'ai-images' | 'seed'>('projects');
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  const handleOpenAdmin = (tab: 'projects' | 'certifications' | 'blog' | 'messages' | 'ai-images' | 'seed' = 'projects') => {
    setAdminTab(tab);
    setAdminModalOpen(true);
  };

  // User auth state
  const [user, setUser] = useState<User | null>(null);

  // Firestore real-time collections
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [loadingCerts, setLoadingCerts] = useState<boolean>(true);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  // Sync dark class on <html> element and persist in localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Projects (fallback to initial seed if empty)
  useEffect(() => {
    try {
      const q = query(collection(db, 'projects'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: Project[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<Project, 'id'>)
            }));
            fetched.sort((a, b) => (a.order || 99) - (b.order || 99));
            setProjects(fetched);
          } else {
            setProjects(
              INITIAL_PROJECTS.map((p, idx) => ({
                id: `seed-${idx}`,
                ...p
              }))
            );
          }
          setLoadingProjects(false);
        },
        (error) => {
          console.warn('Firestore projects listener fallback notice:', error);
          setProjects(
            INITIAL_PROJECTS.map((p, idx) => ({
              id: `seed-${idx}`,
              ...p
            }))
          );
          setLoadingProjects(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      setProjects(
        INITIAL_PROJECTS.map((p, idx) => ({
          id: `seed-${idx}`,
          ...p
        }))
      );
      setLoadingProjects(false);
    }
  }, []);

  // Real-time Firestore sync for Certifications (fallback to initial seed if empty)
  useEffect(() => {
    try {
      const q = query(collection(db, 'certifications'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: Certification[] = snapshot.docs.map((doc) => ({
              ...(doc.data() as Omit<Certification, 'id'>),
              id: doc.id
            }));
            const fetchedTitles = new Set(fetched.map((c) => c.title.toLowerCase().trim()));
            const missingSeed = INITIAL_CERTIFICATIONS.filter(
              (c) => !fetchedTitles.has(c.title.toLowerCase().trim())
            ).map((c) => ({
              id: `seed-cert-missing-${c.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              ...c
            }));

            const mapCertImage = (cert: Certification): Certification => {
              const lowerTitle = cert.title.toLowerCase();
              let updated = { ...cert };
              if (lowerTitle.includes('cloud essentials')) {
                updated.imageUrl = '/aws-cloud-essentials-badge.svg';
                if (!updated.credentialUrl || updated.credentialUrl.includes('aws.amazon.com/training')) {
                  updated.credentialUrl = 'https://www.credly.com/badges/9661204a-8ea2-4423-9732-1826cf08c475/public_url';
                }
              }
              if (lowerTitle.includes('amazon q')) {
                updated.imageUrl = '/aws-amazon-q-badge.svg';
                if (!updated.credentialUrl || updated.credentialUrl.includes('aws.amazon.com/training')) {
                  updated.credentialUrl = 'https://www.credly.com/badges/3d21ba0f-6f80-4221-a7ca-78f0dfd6f850/public_url';
                }
              }
              if (lowerTitle.includes('google ads')) {
                updated.imageUrl = '/coursera-google-ads.svg';
                if (!updated.credentialUrl) {
                  updated.credentialUrl = 'https://coursera.org/verify/2TIO7919CAA3';
                }
              }
              if (lowerTitle.includes('siemens')) {
                updated.imageUrl = '/siemens-forage-cert.svg';
                if (!updated.credentialUrl) {
                  updated.credentialUrl = 'https://www.theforage.com/simulations/siemens/project-management';
                }
              }
              if (lowerTitle.includes('btech') || lowerTitle.includes('computer science')) {
                updated.issueDate = '2026';
              }
              return updated;
            };

            const isRemovedCert = (title: string) => {
              const t = title.toLowerCase();
              return (
                t.includes('solutions architect') ||
                t.includes('kubernetes administrator') ||
                t.includes('cka')
              );
            };

            const seenIds = new Set<string>();
            const seenTitles = new Set<string>();
            const combined: Certification[] = [];

            for (const c of [...fetched, ...missingSeed]) {
              if (isRemovedCert(c.title)) continue;
              const mapped = mapCertImage(c);
              const normalizedTitle = mapped.title.toLowerCase().trim();
              if (!seenIds.has(mapped.id) && !seenTitles.has(normalizedTitle)) {
                seenIds.add(mapped.id);
                seenTitles.add(normalizedTitle);
                combined.push(mapped);
              }
            }

            combined.sort((a, b) => (a.order || 99) - (b.order || 99));
            setCertifications(combined);
          } else {
            setCertifications(
              INITIAL_CERTIFICATIONS.map((c, idx) => ({
                id: `seed-cert-${idx}`,
                ...c
              }))
            );
          }
          setLoadingCerts(false);
        },
        (error) => {
          console.warn('Firestore certs listener fallback notice:', error);
          setCertifications(
            INITIAL_CERTIFICATIONS.map((c, idx) => ({
              id: `seed-cert-${idx}`,
              ...c
            }))
          );
          setLoadingCerts(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      setCertifications(
        INITIAL_CERTIFICATIONS.map((c, idx) => ({
          id: `seed-cert-${idx}`,
          ...c
        }))
      );
      setLoadingCerts(false);
    }
  }, []);

  // Real-time Firestore sync for Blog Posts (fallback to initial seed if empty)
  useEffect(() => {
    try {
      const q = query(collection(db, 'posts'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: BlogPost[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<BlogPost, 'id'>)
            }));
            fetched.sort((a, b) => (a.order || 99) - (b.order || 99));
            setPosts(fetched);
          } else {
            setPosts(
              INITIAL_POSTS.map((post, idx) => ({
                id: `seed-post-${idx}`,
                ...post
              }))
            );
          }
          setLoadingPosts(false);
        },
        (error) => {
          console.warn('Firestore posts listener fallback notice:', error);
          setPosts(
            INITIAL_POSTS.map((post, idx) => ({
              id: `seed-post-${idx}`,
              ...post
            }))
          );
          setLoadingPosts(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      setPosts(
        INITIAL_POSTS.map((post, idx) => ({
          id: `seed-post-${idx}`,
          ...post
        }))
      );
      setLoadingPosts(false);
    }
  }, []);

  // Real-time Firestore sync for Messages (when admin logged in)
  useEffect(() => {
    if (!user) return;
    try {
      const q = query(collection(db, 'messages'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetched: ContactMessage[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<ContactMessage, 'id'>)
          }));
          setMessages(fetched);
        },
        (err) => console.warn('Messages listener notice:', err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Messages query notice:', e);
    }
  }, [user]);

  // Enforce authorized admin user check
  useEffect(() => {
    if (user && user.email?.toLowerCase() !== 'fredaesiofori905@gmail.com') {
      console.warn('Unauthorized user attempted admin access. Revoking session:', user.email);
      auth.signOut();
      setAdminModalOpen(false);
    }
  }, [user]);

  // Handle /admin route check on initial URL or hash
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setAdminModalOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans bg-gray-50 text-gray-900 dark:bg-[#080808] dark:text-gray-100">
      {/* Dynamic SEO Meta & Social Sharing Tags */}
      <SEO />

      {/* Top Viewport Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Navigation Header */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAdmin={() => handleOpenAdmin('projects')}
        isAdminLoggedIn={!!user}
        onOpenChat={() => setChatOpen(true)}
        onOpenImageStudio={() => handleOpenAdmin('ai-images')}
      />

      {/* Main Single Page App Sections */}
      <main>
        <Hero onOpenResume={() => setResumeOpen(true)} />
        <About />
        <Projects projects={projects} loading={loadingProjects} />
        <Skills />
        <Certifications certifications={certifications} loading={loadingCerts} />
        <Blog posts={posts} loading={loadingPosts} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Action Launcher Bar (Bottom Right) */}
      {!chatOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
          {!!user && (
            <button
              onClick={() => handleOpenAdmin('ai-images')}
              className="p-3 bg-[#121212] border border-[#C5A059]/50 hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black rounded-full shadow-2xl transition-all group flex items-center gap-2 text-xs font-mono font-bold"
              title="Launch Admin AI Image Studio"
            >
              <Sparkles size={18} />
              <span className="hidden sm:inline">AI Studio (Admin)</span>
            </button>
          )}

          <button
            onClick={() => setChatOpen(true)}
            className="p-3 bg-[#E2725B] text-black hover:bg-[#c95d46] rounded-full shadow-2xl transition-all group flex items-center gap-2 text-xs font-mono font-bold"
            title="Ask Freda AI Assistant"
          >
            <MessageSquare size={18} />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
        </div>
      )}

      {/* Gemini Multi-turn Chatbot Modal Drawer */}
      <GeminiChatbot
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onOpenImageStudio={() => handleOpenAdmin('ai-images')}
      />

      {/* Resume/CV Viewer Modal */}
      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}

      {/* Admin Panel / Admin Login Modals */}
      {adminModalOpen && (
        user ? (
          <AdminPanel
            projects={projects}
            certifications={certifications}
            messages={messages}
            posts={posts}
            initialTab={adminTab}
            onClose={() => setAdminModalOpen(false)}
            onRefresh={() => {}}
          />
        ) : (
          <AdminLogin
            onSuccess={() => setAdminModalOpen(true)}
            onClose={() => setAdminModalOpen(false)}
          />
        )
      )}
    </div>
  );
}
