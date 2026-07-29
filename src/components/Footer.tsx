import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { KenteDivider } from './AdinkraMotif';
import { Github, Linkedin, Mail, ArrowUp, Send, CheckCircle2, AlertCircle, Bell, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'subscribers'), {
        email: trimmedEmail,
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      // Trigger automated email notification via Firebase Trigger Email extension
      try {
        await addDoc(collection(db, 'mail'), {
          to: ['fredaesiofori905@gmail.com'],
          message: {
            subject: `[Freda Creations] New Newsletter Subscriber: ${trimmedEmail}`,
            text: `A new user subscribed to your newsletter updates: ${trimmedEmail}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; background-color: #080808; color: #ffffff; border-radius: 8px;">
                <h2 style="color: #E2725B; margin-top: 0;">🎉 New Newsletter Subscriber!</h2>
                <p>A visitor has subscribed to your Cloud & DevOps site updates:</p>
                <p style="font-size: 16px; font-weight: bold; color: #C5A059;">${trimmedEmail}</p>
                <p style="font-size: 12px; color: #888888;">Subscribed on ${new Date().toLocaleString()}</p>
              </div>
            `
          },
          createdAt: new Date().toISOString()
        });
      } catch (mailErr) {
        console.warn('Mail extension subscriber notification notice:', mailErr);
      }

      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 7000);
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setError('Unable to subscribe right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-[#080808] text-gray-600 dark:text-gray-400 py-12 border-t border-gray-200 dark:border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <KenteDivider />

        {/* Newsletter Subscription Section */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#121212] dark:via-[#161616] dark:to-[#0f0f0f] border border-gray-200 dark:border-[#E2725B]/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          {/* Subtle Ambient Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2725B]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2725B]/10 border border-[#E2725B]/30 text-[#E2725B] text-[11px] font-mono font-bold uppercase tracking-wider">
                <Bell size={13} />
                <span>Stay Connected</span>
                <Sparkles size={11} className="text-[#C5A059]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                Subscribe to <span className="text-[#E2725B] italic">Tech & Engineering</span> Updates
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                Get notified when Freda publishes new Cloud & DevOps articles, Afrofuturist technical guides, and major open-source project showcases. Unsubscribe anytime.
              </p>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative w-full">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-slate-50 dark:bg-[#080808] border border-gray-300 dark:border-white/15 focus:border-[#E2725B] rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl bg-[#E2725B] hover:bg-[#c95d46] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-500/40 text-teal-800 dark:text-teal-200 text-xs flex items-center gap-2.5">
                    <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <p className="font-bold">Subscription confirmed!</p>
                      <p className="text-[11px]">You're now subscribed to Freda's site & engineering updates.</p>
                    </div>
                  </div>
                )}

                <p className="text-[10px] font-mono text-gray-500">
                  ⚡ Zero spam. Secured with Google Cloud Firestore.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Brand & Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#E2725B] text-black font-black flex items-center justify-center text-sm shadow-md">
              F
            </div>
            <div>
              <span className="font-black text-gray-900 dark:text-white text-base tracking-tight uppercase">
                FREDA <span className="text-[#E2725B]">CREATIONS</span>
              </span>
              <span className="block text-[10px] font-mono text-gray-500 dark:text-gray-400">
                Accra, Ghana • Cloud & DevOps Engineering
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-700 dark:text-gray-300">
            <a href="#about" className="hover:text-[#E2725B] transition-colors">
              01. Overview
            </a>
            <a href="#projects" className="hover:text-[#E2725B] transition-colors">
              02. Engineering
            </a>
            <a href="#skills" className="hover:text-[#E2725B] transition-colors">
              03. Skills
            </a>
            <a href="#certifications" className="hover:text-[#E2725B] transition-colors">
              04. Credentials
            </a>
            <a href="#blog" className="hover:text-[#E2725B] transition-colors">
              05. Blog
            </a>
            <a href="#contact" className="hover:text-[#E2725B] transition-colors">
              06. Contact
            </a>
          </div>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/fredaesiofori"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded bg-white dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-[#E2725B] border border-gray-200 dark:border-white/10 transition-colors shadow-xs"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com/in/freda-ofori"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded bg-white dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] border border-gray-200 dark:border-white/10 transition-colors shadow-xs"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded bg-[#E2725B]/20 hover:bg-[#E2725B]/30 text-[#E2725B] border border-[#E2725B]/30 transition-colors cursor-pointer"
              title="Scroll to Top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-mono">
          <p>© {new Date().getFullYear()} Freda Ofori (Freda Creations). All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-gray-600 dark:text-gray-400">
            React 19 • Tailwind CSS • Firestore • Sleek Interface
          </p>
        </div>
      </div>
    </footer>
  );
};

