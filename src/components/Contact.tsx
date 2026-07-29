import React, { useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { KenteDivider } from './AdinkraMotif';
import { Mail, Linkedin, Github, MapPin, Send, CheckCircle2, Copy, AlertCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailAddress = 'fredaesiofori905@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: new Date().toISOString(),
        read: false
      });

      // Trigger automated email via Firebase Trigger Email extension
      try {
        await addDoc(collection(db, 'mail'), {
          to: ['fredaesiofori905@gmail.com'],
          message: {
            subject: `[Freda Creations] New Contact Message: ${formData.subject || 'Portfolio Inquiry'}`,
            text: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; background-color: #080808; color: #ffffff; border-radius: 8px;">
                <h2 style="color: #E2725B; margin-top: 0;">New Portfolio Message Received</h2>
                <p><strong>From Name:</strong> ${formData.name}</p>
                <p><strong>Email Address:</strong> <a href="mailto:${formData.email}" style="color: #C5A059;">${formData.email}</a></p>
                <p><strong>Subject:</strong> ${formData.subject || 'N/A'}</p>
                <hr style="border-color: #333;" />
                <p style="white-space: pre-wrap; color: #dddddd;">${formData.message}</p>
              </div>
            `
          },
          createdAt: new Date().toISOString()
        });
      } catch (mailErr) {
        console.warn('Mail extension trigger document creation notice:', mailErr);
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 6000);
    } catch (err: any) {
      console.warn('Firestore submission notice, launching direct mail client:', err);
      window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(
        formData.subject || 'Portfolio Inquiry'
      )}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-white dark:bg-[#080808] border-t border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2725B]/40 bg-[#E2725B]/10 text-[#E2725B] text-xs font-mono font-bold tracking-widest uppercase">
            <Mail size={15} />
            <span>06. Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-gray-900 dark:text-white">
            Let's <span className="text-[#E2725B] italic">Connect</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Have a cloud engineering project, DevOps role, or collaboration in mind?
          </p>
          <KenteDivider />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#121212] border border-gray-200 dark:border-[#E2725B]/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#E2725B] uppercase tracking-wider font-bold">Direct Email</span>
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded bg-white dark:bg-[#080808] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-mono flex items-center gap-1.5 border border-gray-200 dark:border-white/10"
                >
                  <Copy size={12} />
                  <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#E2725B]/10 border border-[#E2725B]/30 text-[#E2725B] shrink-0">
                  <Mail size={22} />
                </div>
                <div className="overflow-hidden">
                  <a
                    href={`mailto:${emailAddress}`}
                    className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#E2725B] transition-colors block truncate"
                  >
                    {emailAddress}
                  </a>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Response within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 space-y-4 shadow-sm">
              <h3 className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase tracking-wider">Professional Profiles</h3>

              <div className="space-y-3">
                <a
                  href="https://github.com/fredaesiofori"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white dark:bg-[#080808] hover:border-[#E2725B]/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Github size={20} className="text-[#E2725B] group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">GitHub</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">github.com/fredaesiofori</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#E2725B]">→</span>
                </a>

                <a
                  href="https://linkedin.com/in/freda-ofori"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white dark:bg-[#080808] hover:border-[#C5A059]/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin size={20} className="text-[#C5A059] group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">LinkedIn</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">linkedin.com/in/freda-ofori</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#C5A059]">→</span>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-300 shadow-xs">
                  <MapPin size={20} className="text-[#E2725B] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase">Location & Timezone</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Accra, Ghana • GMT / UTC+0</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-xl bg-slate-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">Send Message</h3>
                <span className="text-[10px] font-mono text-[#E2725B] uppercase font-bold">Freda Creations</span>
              </div>

              {error && (
                <div className="p-3.5 rounded bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 rounded bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-500/40 text-teal-900 dark:text-teal-200 text-xs flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <p className="font-bold">Message received!</p>
                    <p className="text-[11px]">Thank you for reaching out. Freda will respond shortly.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-700 dark:text-gray-300 mb-1.5 uppercase">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwame Mensah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 min-h-[44px] bg-white dark:bg-[#080808] border border-gray-300 dark:border-white/10 rounded text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E2725B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-700 dark:text-gray-300 mb-1.5 uppercase">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. kwame@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 min-h-[44px] bg-white dark:bg-[#080808] border border-gray-300 dark:border-white/10 rounded text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E2725B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Architecture Inquiry / DevOps Role"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 min-h-[44px] bg-white dark:bg-[#080808] border border-gray-300 dark:border-white/10 rounded text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E2725B]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-700 dark:text-gray-300 mb-1.5 uppercase">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your project or inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#080808] border border-gray-300 dark:border-white/10 rounded text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E2725B]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 min-h-[44px] rounded bg-[#E2725B] hover:bg-[#E2725B]/90 text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
