import React, { useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Project, Certification, ContactMessage, BlogPost } from '../../types';
import { INITIAL_PROJECTS, INITIAL_CERTIFICATIONS, INITIAL_POSTS } from '../../lib/seedData';
import { FileUploader } from './FileUploader';
import {
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Database,
  Layers,
  Award,
  Mail,
  Upload,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Save,
  RefreshCw,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  Copy,
  Ratio,
  Loader2,
  Download,
  Check
} from 'lucide-react';

interface AdminPanelProps {
  projects: Project[];
  certifications: Certification[];
  messages: ContactMessage[];
  posts?: BlogPost[];
  initialTab?: 'projects' | 'certifications' | 'blog' | 'messages' | 'ai-images' | 'uploader' | 'seed';
  onClose: () => void;
  onRefresh: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  certifications,
  messages,
  posts = [],
  initialTab = 'projects',
  onClose,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'certifications' | 'blog' | 'messages' | 'ai-images' | 'uploader' | 'seed'>(initialTab);

  // AI Image Studio States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSize, setAiSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aiAspectRatio, setAiAspectRatio] = useState('1:1');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedImages, setAiGeneratedImages] = useState<Array<{
    id: string;
    prompt: string;
    imageUrl: string;
    size: '1K' | '2K' | '4K';
    aspectRatio: string;
    createdAt: string;
  }>>([]);
  const [selectedAiImage, setSelectedAiImage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Form states for Projects
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    category: 'Cloud & DevOps',
    techStack: [],
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: false,
    order: 1
  });
  const [techInput, setTechInput] = useState('');

  // Form states for Certifications
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certForm, setCertForm] = useState<Omit<Certification, 'id'>>({
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    imageUrl: '',
    order: 1
  });

  // Form states for Blog Posts
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postForm, setPostForm] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    summary: '',
    content: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: 'Freda Ofori',
    authorRole: 'Cloud & DevOps Engineer',
    readTime: '5 min read',
    tags: ['DevOps', 'Cloud'],
    imageUrl: '',
    featured: false,
    order: 1
  });
  const [postTagInput, setPostTagInput] = useState('');

  // Feedback UI states
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSignOut = async () => {
    await auth.signOut();
    onClose();
  };

  const notify = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // AI Image Generator Handler
  const handleGenerateAiImage = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || aiPrompt;
    if (!promptToUse.trim() || aiGenerating) return;

    setAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse.trim(),
          size: aiSize,
          aspectRatio: aiAspectRatio
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image.');
      }

      const newImg = {
        id: `img-${Date.now()}`,
        prompt: promptToUse.trim(),
        imageUrl: data.imageUrl,
        size: (data.size || aiSize) as '1K' | '2K' | '4K',
        aspectRatio: data.aspectRatio || aiAspectRatio,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAiGeneratedImages((prev) => [newImg, ...prev]);
      setSelectedAiImage(data.imageUrl);
      notify('success', `Generated ${aiSize} image with Gemini AI Studio!`);
    } catch (err: any) {
      console.error('AI Image Studio Error:', err);
      notify('error', 'Image generation error: ' + (err.message || 'Error generating image'));
    } finally {
      setAiGenerating(false);
    }
  };

  const applyImageToForm = (imageUrl: string, target: 'project' | 'cert' | 'post') => {
    if (target === 'project') {
      setProjectForm((prev) => ({ ...prev, imageUrl }));
      setActiveTab('projects');
      notify('success', 'Image assigned to Project cover!');
    } else if (target === 'cert') {
      setCertForm((prev) => ({ ...prev, imageUrl }));
      setActiveTab('certifications');
      notify('success', 'Image assigned to Certification cover!');
    } else if (target === 'post') {
      setPostForm((prev) => ({ ...prev, imageUrl }));
      setActiveTab('blog');
      notify('success', 'Image assigned to Blog article cover!');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    notify('success', 'Image URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  // Image Upload to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'project' | 'cert' | 'post') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'FoodBridge-image');
      formData.append('folder', target === 'cert' ? 'certificates' : 'projects');

      const res = await fetch('https://api.cloudinary.com/v1_1/rxvsugga/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      const downloadUrl = data.secure_url;

      if (target === 'project') {
        setProjectForm((prev) => ({ ...prev, imageUrl: downloadUrl }));
      } else if (target === 'cert') {
        setCertForm((prev) => ({ ...prev, imageUrl: downloadUrl }));
      } else {
        setPostForm((prev) => ({ ...prev, imageUrl: downloadUrl }));
      }
      notify('success', 'File uploaded to Cloudinary successfully!');
    } catch (err: any) {
      console.warn('Cloudinary upload notice, linking local preview:', err);
      const fallbackUrl = URL.createObjectURL(file);
      if (target === 'project') {
        setProjectForm((prev) => ({ ...prev, imageUrl: fallbackUrl }));
      } else if (target === 'cert') {
        setCertForm((prev) => ({ ...prev, imageUrl: fallbackUrl }));
      } else {
        setPostForm((prev) => ({ ...prev, imageUrl: fallbackUrl }));
      }
      notify('error', `Cloudinary upload failed: ${err.message}. Local preview linked.`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Seed Initial Firestore Data
  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      // Seed projects
      for (const proj of INITIAL_PROJECTS) {
        await addDoc(collection(db, 'projects'), {
          ...proj,
          createdAt: new Date().toISOString()
        });
      }

      // Seed certs
      for (const cert of INITIAL_CERTIFICATIONS) {
        await addDoc(collection(db, 'certifications'), {
          ...cert,
          createdAt: new Date().toISOString()
        });
      }

      // Seed blog posts
      for (const post of INITIAL_POSTS) {
        await addDoc(collection(db, 'posts'), {
          ...post,
          createdAt: new Date().toISOString()
        });
      }

      notify('success', 'Database seeded with initial projects, certificates & blog articles!');
      onRefresh();
    } catch (err: any) {
      console.error('Seed error:', err);
      notify('error', 'Failed to seed database: ' + (err.message || 'Error writing to Firestore'));
    } finally {
      setSeeding(false);
    }
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      notify('error', 'Please fill in required project fields.');
      return;
    }

    setSaving(true);
    try {
      if (editingProject && editingProject.id) {
        // Use setDoc with { merge: true } to upsert (creates document if missing, e.g. seed data)
        await setDoc(doc(db, 'projects', editingProject.id), {
          ...projectForm,
          createdAt: editingProject.createdAt || new Date().toISOString()
        }, { merge: true });
        notify('success', 'Project saved successfully!');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectForm,
          createdAt: new Date().toISOString()
        });
        notify('success', 'New project saved to Firestore!');
      }

      setEditingProject(null);
      setProjectForm({
        title: '',
        description: '',
        category: 'Cloud & DevOps',
        techStack: [],
        liveUrl: '',
        githubUrl: '',
        imageUrl: '',
        featured: false,
        order: projects.length + 1
      });
      onRefresh();
    } catch (err: any) {
      console.error('Save project error:', err);
      notify('error', 'Error saving project: ' + (err.message || 'Firestore save failed'));
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id?: string) => {
    if (!id || !window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      notify('success', 'Project deleted.');
      onRefresh();
    } catch (err: any) {
      notify('error', 'Delete failed: ' + err.message);
    }
  };

  // Save Certification
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) {
      notify('error', 'Please fill in certification title and issuer.');
      return;
    }

    setSaving(true);
    try {
      if (editingCert && editingCert.id) {
        await setDoc(doc(db, 'certifications', editingCert.id), {
          ...certForm,
          createdAt: editingCert.createdAt || new Date().toISOString()
        }, { merge: true });
        notify('success', 'Certification saved successfully!');
      } else {
        await addDoc(collection(db, 'certifications'), {
          ...certForm,
          createdAt: new Date().toISOString()
        });
        notify('success', 'Certification saved!');
      }

      setEditingCert(null);
      setCertForm({
        title: '',
        issuer: '',
        issueDate: '',
        credentialUrl: '',
        imageUrl: '',
        order: certifications.length + 1
      });
      onRefresh();
    } catch (err: any) {
      console.error('Save certification error:', err);
      notify('error', 'Error saving certificate: ' + (err.message || 'Firestore save failed'));
    } finally {
      setSaving(false);
    }
  };

  // Delete Certification
  const handleDeleteCert = async (id?: string) => {
    if (!id || !window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await deleteDoc(doc(db, 'certifications', id));
      notify('success', 'Certification deleted.');
      onRefresh();
    } catch (err: any) {
      notify('error', 'Delete failed: ' + err.message);
    }
  };

  // Save Blog Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) {
      notify('error', 'Article title and markdown content are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingPost && editingPost.id) {
        await setDoc(doc(db, 'posts', editingPost.id), {
          ...postForm,
          createdAt: editingPost.createdAt || new Date().toISOString()
        }, { merge: true });
        notify('success', 'Blog article saved successfully!');
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postForm,
          createdAt: new Date().toISOString()
        });
        notify('success', 'New blog article published!');
      }

      setEditingPost(null);
      setPostForm({
        title: '',
        summary: '',
        content: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        author: 'Freda Ofori',
        authorRole: 'Cloud & DevOps Engineer',
        readTime: '5 min read',
        tags: ['DevOps', 'Cloud'],
        imageUrl: '',
        featured: false,
        order: posts.length + 1
      });
      onRefresh();
    } catch (err: any) {
      console.error('Save post error:', err);
      notify('error', 'Error saving article: ' + (err.message || 'Firestore save failed'));
    } finally {
      setSaving(false);
    }
  };

  // Delete Blog Post
  const handleDeletePost = async (id?: string) => {
    if (!id || !window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      notify('success', 'Article deleted.');
      onRefresh();
    } catch (err: any) {
      notify('error', 'Delete failed: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 dark:bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#E2725B]/40 rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[92vh] flex flex-col shadow-2xl my-auto overflow-hidden text-gray-900 dark:text-gray-100">
        {/* Top Bar Header */}
        <div className="p-3 sm:p-4 bg-slate-100 dark:bg-[#080808] border-b border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#E2725B] text-black font-black flex items-center justify-center text-base shrink-0">
              F
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight truncate">
                Freda Creations Admin Dashboard
              </h2>
              <p className="text-[10px] sm:text-[11px] font-mono text-[#E2725B] truncate max-w-[220px] xs:max-w-[280px] sm:max-w-md">
                Active Admin: {auth.currentUser?.email || 'Logged In'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={onRefresh}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-[#E2725B] dark:hover:text-[#E2725B] flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-2.5 min-h-[44px] rounded-lg bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut size={14} /> Log Out
            </button>
            <button
              onClick={onClose}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center"
              title="Close Admin Panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-2.5 sm:p-3 bg-slate-50 dark:bg-[#080808]/80 border-b border-gray-200 dark:border-white/10 px-3 sm:px-6 overflow-x-auto scrollbar-none no-scrollbar">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === 'projects'
                ? 'bg-[#E2725B] text-black'
                : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <Layers size={14} /> Projects ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === 'certifications'
                ? 'bg-[#C5A059] text-black'
                : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <Award size={14} /> Credentials ({certifications.length})
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === 'blog'
                ? 'bg-[#E2725B] text-black'
                : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <BookOpen size={14} /> Blog Articles ({posts.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === 'messages'
                ? 'bg-[#C5A059] text-black'
                : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <Mail size={14} /> Messages ({messages.length})
          </button>

          <button
            onClick={() => setActiveTab('uploader')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === 'uploader'
                ? 'bg-teal-500 text-black font-extrabold shadow-md shadow-teal-500/20'
                : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <UploadCloud size={14} /> Asset Uploader
          </button>

          <button
            onClick={() => setActiveTab('ai-images')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === 'ai-images'
                ? 'bg-gradient-to-r from-[#C5A059] to-[#E2725B] text-black font-extrabold'
                : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <Sparkles size={14} /> AI Image Studio
          </button>

          <button
            onClick={() => setActiveTab('seed')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === 'seed'
                ? 'bg-[#E2725B] text-black'
                : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <Database size={14} /> Seed Data
          </button>
        </div>

        {/* Toast status alert */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded text-xs flex items-center gap-2 border ${
              statusMessage.type === 'success'
                ? 'bg-teal-50 dark:bg-teal-950/90 border-teal-300 dark:border-teal-500 text-teal-800 dark:text-teal-200'
                : 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-500 text-rose-800 dark:text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Tabs */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <form onSubmit={handleSaveProject} className="p-6 rounded-xl bg-[#080808] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-[#E2725B] uppercase border-b border-white/10 pb-2">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Category</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                    >
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Full-Stack & PWA">Full-Stack & PWA</option>
                      <option value="AI & Civic Tech">AI & Civic Tech</option>
                      <option value="Serverless">Serverless</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Tech Stack Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. React 19, Docker"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (techInput.trim() && !projectForm.techStack.includes(techInput.trim())) {
                            setProjectForm((prev) => ({ ...prev, techStack: [...prev.techStack, techInput.trim()] }));
                          }
                          setTechInput('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#121212] border border-white/10 rounded text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (techInput.trim() && !projectForm.techStack.includes(techInput.trim())) {
                          setProjectForm((prev) => ({ ...prev, techStack: [...prev.techStack, techInput.trim()] }));
                        }
                        setTechInput('');
                      }}
                      className="px-3 py-1.5 bg-white/10 text-xs text-[#E2725B]"
                    >
                      Add Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {projectForm.techStack.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/10 text-[#E2725B] flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => setProjectForm((prev) => ({ ...prev, techStack: prev.techStack.filter((t) => t !== tag) }))}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">GitHub Repo URL</label>
                    <input
                      type="url"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>

                {/* File Uploader for Project Screenshot */}
                <div className="pt-2">
                  <FileUploader
                    folder="projects"
                    accept="image/*"
                    label="Project Screenshot / Cover Asset"
                    helperText="Select or drag a screenshot image from device library (Max 10MB)"
                    initialUrl={projectForm.imageUrl}
                    onUploadSuccess={(downloadUrl) =>
                      setProjectForm((prev) => ({ ...prev, imageUrl: downloadUrl }))
                    }
                    onClear={() => setProjectForm((prev) => ({ ...prev, imageUrl: '' }))}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    />
                    <span>Highlight as Featured Project</span>
                  </label>

                  <button
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="px-5 py-2.5 bg-[#E2725B] text-black font-bold text-xs uppercase tracking-wider rounded"
                  >
                    {editingProject ? 'Update Project' : 'Save Project'}
                  </button>
                </div>
              </form>

              {/* Existing Projects */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase text-gray-400">Existing Projects ({projects.length})</h4>
                {projects.map((p) => (
                  <div key={p.id || p.title} className="p-3.5 sm:p-4 rounded-xl bg-[#080808] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => { setEditingProject(p); setProjectForm(p); }}
                        className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-white/5 text-[#E2725B] hover:bg-white/10 flex items-center justify-center cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 flex items-center justify-center cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-8">
              <form onSubmit={handleSaveCert} className="p-6 rounded-xl bg-[#080808] border border-white/10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-[#C5A059] uppercase">
                    {editingCert ? 'Edit Certification' : 'Add New Certification'}
                  </h3>
                  {editingCert && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCert(null);
                        setCertForm({
                          title: '',
                          issuer: '',
                          issueDate: '',
                          credentialUrl: '',
                          imageUrl: '',
                          order: certifications.length + 1
                        });
                      }}
                      className="text-xs text-gray-400 hover:text-white cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Title *</label>
                    <input type="text" required value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Issuer (Organization) *</label>
                    <input type="text" required value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Issue Date (e.g. June 2024)</label>
                    <input type="text" placeholder="e.g. June 2024 or 2024-05" value={certForm.issueDate || ''} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white font-mono" />
                  </div>
                </div>

                {/* File Uploader for Certificate Image or PDF */}
                <div className="pt-2">
                  <FileUploader
                    folder="certificates"
                    accept="image/*,.pdf"
                    label="Certificate Document / Badge Asset"
                    helperText="Pick a PDF certificate or badge image from your device (Max 10MB)"
                    initialUrl={certForm.imageUrl}
                    onUploadSuccess={(downloadUrl) =>
                      setCertForm((prev) => ({
                        ...prev,
                        imageUrl: downloadUrl,
                        credentialUrl: downloadUrl
                      }))
                    }
                    onClear={() => setCertForm((prev) => ({ ...prev, imageUrl: '', credentialUrl: '' }))}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={saving || uploadingImage} className="px-5 py-2.5 bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer hover:bg-[#b08d48] transition-colors">
                    {editingCert ? 'Update Certificate' : 'Save Certificate'}
                  </button>
                </div>
              </form>

              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase text-gray-400">Existing Credentials ({certifications.length})</h4>
                {certifications.map((c, idx) => (
                  <div key={c.id ? `admin-cert-${c.id}` : `admin-cert-${idx}-${c.title}`} className="p-3.5 sm:p-4 rounded-xl bg-[#080808] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{c.title}</h4>
                      <p className="text-[11px] text-[#C5A059] mt-0.5">{c.issuer} {c.issueDate ? `• ${c.issueDate}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => { setEditingCert(c); setCertForm(c); }}
                        className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-white/5 text-[#C5A059] hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
                        title="Edit Certification"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(c.id)}
                        className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 flex items-center justify-center cursor-pointer transition-colors"
                        title="Delete Certification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BLOG ARTICLES */}
          {activeTab === 'blog' && (
            <div className="space-y-8">
              <form onSubmit={handleSavePost} className="p-6 rounded-xl bg-[#080808] border border-white/10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-[#E2725B] uppercase">
                    {editingPost ? 'Edit Blog Article' : 'Publish New Blog Article'}
                  </h3>
                  {editingPost && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPost(null);
                        setPostForm({
                          title: '',
                          summary: '',
                          content: '',
                          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                          author: 'Freda Ofori',
                          authorRole: 'Cloud & DevOps Engineer',
                          readTime: '5 min read',
                          tags: ['DevOps', 'Cloud'],
                          imageUrl: '',
                          featured: false,
                          order: posts.length + 1
                        });
                      }}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Building AI-Augmented Cloud Infrastructure"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Author & Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={postForm.author}
                        onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                        className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={postForm.readTime}
                        onChange={(e) => setPostForm({ ...postForm, readTime: e.target.value })}
                        className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Summary / Excerpt *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Short 2-sentence summary of the article..."
                    value={postForm.summary}
                    onChange={(e) => setPostForm({ ...postForm, summary: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Markdown Content *</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="# Article Heading&#10;&#10;Write article content using standard Markdown syntax..."
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white font-mono"
                  />
                </div>

                {/* Article Tags */}
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Tags (e.g. Terraform, Kubernetes, AI)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={postTagInput}
                      onChange={(e) => setPostTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (postTagInput.trim() && !postForm.tags.includes(postTagInput.trim())) {
                            setPostForm((prev) => ({ ...prev, tags: [...prev.tags, postTagInput.trim()] }));
                          }
                          setPostTagInput('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#121212] border border-white/10 rounded text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (postTagInput.trim() && !postForm.tags.includes(postTagInput.trim())) {
                          setPostForm((prev) => ({ ...prev, tags: [...prev.tags, postTagInput.trim()] }));
                        }
                        setPostTagInput('');
                      }}
                      className="px-3 py-1.5 bg-white/10 text-xs text-[#E2725B]"
                    >
                      Add Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {postForm.tags?.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/10 text-[#E2725B] flex items-center gap-1">
                        #{tag}
                        <button type="button" onClick={() => setPostForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Cover */}
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Cover Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL..."
                      value={postForm.imageUrl}
                      onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 bg-[#121212] border border-white/10 rounded text-xs text-white"
                    />
                    <label className="px-3 py-2 bg-white/10 text-xs text-[#E2725B] rounded cursor-pointer flex items-center gap-1">
                      <Upload size={13} /> Upload Image
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'post')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postForm.featured}
                      onChange={(e) => setPostForm({ ...postForm, featured: e.target.checked })}
                    />
                    <span>Highlight as Featured Read</span>
                  </label>

                  <button
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="px-5 py-2.5 bg-[#E2725B] text-black font-bold text-xs uppercase tracking-wider rounded"
                  >
                    {editingPost ? 'Update Article' : 'Publish Article'}
                  </button>
                </div>
              </form>

              {/* Published Articles List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase text-gray-400">Published Blog Articles ({posts.length})</h4>
                {posts.map((post) => (
                  <div key={post.id || post.title} className="p-3.5 sm:p-4 rounded-xl bg-[#080808] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{post.date} • By {post.author}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setPostForm(post);
                        }}
                        className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-white/5 text-[#E2725B] hover:bg-white/10 flex items-center justify-center cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 flex items-center justify-center cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono text-gray-400 uppercase">Received Contact Form Submissions ({messages.length})</h3>
              {messages.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-xs font-mono">No contact form messages yet.</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl bg-[#080808] border border-white/10 space-y-2">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold text-white">{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="text-[#E2725B] ml-2 underline">{msg.email}</a>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{msg.createdAt}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#C5A059]">{msg.subject || 'Inquiry'}</p>
                    <p className="text-xs text-gray-300 leading-relaxed bg-[#121212] p-3 rounded">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: AI IMAGE STUDIO */}
          {activeTab === 'ai-images' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="p-6 rounded-2xl bg-[#080808] border border-[#C5A059]/40 space-y-3 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Gemini High-Resolution AI Image Studio</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Afrofuturist AI Image Generator (Admin)
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                  Generate high-definition imagery (1K, 2K, 4K) using Google Gemini models. Automatically assign generated image URLs to your projects, certifications, or technical blog post covers.
                </p>
              </div>

              {/* Form Input Container */}
              <div className="p-6 rounded-xl bg-[#080808] border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-2">
                    Visual Prompt Description
                  </label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe your visual concept (e.g., '3D metallic gold Adinkra symbol hovering over a neon Cloud Server architecture')..."
                    className="w-full px-3 py-2.5 bg-[#121212] border border-white/15 focus:border-[#C5A059] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                {/* Sample Prompt Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-gray-400">Sample Concept Ideas:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Afrofuturist Cloud Data Center with glowing gold Adinkra symbols and neon lighting",
                      "Cyberpunk Accra Smart City skyline with solar towers and holographic cloud networks",
                      "3D metallic gold AWS Cloud Architect certification emblem on dark obsidian background",
                      "Futuristic African software engineer coding with holographic multi-screen interface"
                    ].map((samplePrompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAiPrompt(samplePrompt)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/40 border border-white/10 text-gray-300 transition-all text-left"
                      >
                        "{samplePrompt.substring(0, 42)}..."
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settings Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                  {/* Resolution Selector */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-gray-300 uppercase mb-1.5">
                      Resolution / Quality
                    </label>
                    <div className="flex gap-2">
                      {(['1K', '2K', '4K'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setAiSize(r)}
                          className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                            aiSize === r
                              ? 'bg-[#C5A059] text-black shadow-md'
                              : 'bg-[#121212] border border-white/10 text-gray-300 hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio Selector */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-gray-300 uppercase mb-1.5 flex items-center gap-1">
                      <Ratio size={12} /> Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: 'Square (1:1)', val: '1:1' },
                        { label: 'Landscape (16:9)', val: '16:9' },
                        { label: 'Standard (4:3)', val: '4:3' },
                        { label: 'Portrait (9:16)', val: '9:16' }
                      ].map((ratio) => (
                        <button
                          key={ratio.val}
                          type="button"
                          onClick={() => setAiAspectRatio(ratio.val)}
                          className={`py-2 px-2 rounded-lg text-[11px] font-semibold transition-all text-center ${
                            aiAspectRatio === ratio.val
                              ? 'bg-[#E2725B] text-black font-bold'
                              : 'bg-[#121212] border border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generate Action Button */}
                <button
                  type="button"
                  onClick={() => handleGenerateAiImage()}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2725B] to-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-40 transition-all shadow-lg"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Generating {aiSize} Image via Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generate {aiSize} Image Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* Selected / Latest Image Preview */}
              {selectedAiImage && (
                <div className="p-6 rounded-2xl bg-[#080808] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <span className="text-xs font-mono font-bold text-[#C5A059] uppercase flex items-center gap-1.5">
                      <ImageIcon size={14} /> Generated Preview
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(selectedAiImage)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedUrl === selectedAiImage ? <Check size={13} className="text-teal-400" /> : <Copy size={13} />}
                        <span>Copy Image URL</span>
                      </button>

                      <a
                        href={selectedAiImage}
                        download={`freda-ai-${Date.now()}.png`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-center bg-black/80 rounded-xl p-3 border border-white/10 max-h-[420px] overflow-hidden">
                    <img
                      src={selectedAiImage}
                      alt="Generated AI Preview"
                      className="max-h-[380px] w-auto object-contain rounded-lg shadow-2xl"
                    />
                  </div>

                  {/* Assign Quick Actions */}
                  <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-2">
                    <span className="block text-[11px] font-mono text-gray-400 uppercase">
                      Directly Assign Image to Draft Content:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyImageToForm(selectedAiImage, 'project')}
                        className="px-3 py-1.5 rounded bg-[#E2725B] text-black text-xs font-bold hover:bg-[#c95d46] transition-all"
                      >
                        Assign as Project Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => applyImageToForm(selectedAiImage, 'cert')}
                        className="px-3 py-1.5 rounded bg-[#C5A059] text-black text-xs font-bold hover:bg-[#b08d48] transition-all"
                      >
                        Assign as Certification Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => applyImageToForm(selectedAiImage, 'post')}
                        className="px-3 py-1.5 rounded bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/10"
                      >
                        Assign as Blog Article Cover
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Session Gallery */}
              {aiGeneratedImages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-gray-400 uppercase">
                    Admin Session History ({aiGeneratedImages.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {aiGeneratedImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setSelectedAiImage(img.imageUrl)}
                        className={`cursor-pointer rounded-xl overflow-hidden border p-1 bg-[#080808] transition-all ${
                          selectedAiImage === img.imageUrl
                            ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img src={img.imageUrl} alt={img.prompt} className="w-full h-24 object-cover rounded-lg" />
                        <div className="p-1.5">
                          <p className="text-[10px] text-gray-400 line-clamp-1 italic">"{img.prompt}"</p>
                          <span className="text-[9px] font-mono text-[#C5A059]">{img.size} • {img.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ASSET & CERTIFICATE FILE UPLOADER */}
          {activeTab === 'uploader' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#080808] border border-teal-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wide flex items-center gap-2">
                    <UploadCloud size={18} className="text-teal-400" />
                    Admin Asset & Certificate Upload Manager
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload images or PDF certificates directly to Cloudinary with real-time progress tracking, and save records to Firestore.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800 shrink-0">
                  Cloudinary + Firestore
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Certificate Upload Form */}
                <div className="p-5 rounded-xl bg-[#080808] border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
                    <Award size={16} />
                    1. Certificates & Credentials Uploader
                  </div>

                  <FileUploader
                    folder="certificates"
                    accept="image/*,.pdf"
                    label="Certificate File (Image or PDF)"
                    helperText="Select or drag a PDF document or badge image from your device"
                    mode="standalone"
                    collectionName="certifications"
                    defaultTitle="AWS Certified Security Specialty"
                    defaultIssuer="Amazon Web Services (AWS)"
                    onFirestoreSaved={() => {
                      notify('success', 'New certificate saved to Firestore!');
                      onRefresh();
                    }}
                  />
                </div>

                {/* Project Screenshot Upload Form */}
                <div className="p-5 rounded-xl bg-[#080808] border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-[#E2725B] uppercase tracking-wider">
                    <Layers size={16} />
                    2. Project Screenshot Uploader
                  </div>

                  <FileUploader
                    folder="projects"
                    accept="image/*"
                    label="Project Screenshot / Banner Image"
                    helperText="Select or drag a project screenshot or architectural diagram image"
                    mode="standalone"
                    collectionName="projects"
                    defaultTitle="Cloud Native Microservices Platform"
                    onFirestoreSaved={() => {
                      notify('success', 'New project screenshot record saved to Firestore!');
                      onRefresh();
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SEED DATA */}
          {activeTab === 'seed' && (
            <div className="p-8 rounded-xl bg-[#080808] border border-[#E2725B]/30 text-center space-y-4">
              <div className="w-12 h-12 rounded bg-[#E2725B]/10 text-[#E2725B] flex items-center justify-center mx-auto border border-[#E2725B]/30">
                <Database size={24} />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Seed Default Portfolio & Blog Data</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                Click below to populate your Firestore collections (`projects`, `certifications`, and `posts`) with default initial data.
              </p>

              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="px-6 py-3 rounded bg-[#E2725B] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto shadow-lg"
              >
                {seeding ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Database size={16} />
                    <span>Populate All Firestore Seed Data</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
