import React from 'react';
import { motion } from 'motion/react';
import { KenteDivider } from './AdinkraMotif';
import { ArrowRight, Download, Mail, Terminal, Cloud, Cpu, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#080808] dark:text-gray-100">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-[#E2725B]/15 via-[#C5A059]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white dark:border-[#E2725B]/40 dark:bg-[#121212] shadow-xl mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#E2725B] animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-[#E2725B] uppercase font-bold">
            Cloud & DevOps Engineer • AI-Assisted Developer
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 ml-2 border-l border-gray-200 dark:border-white/10 pl-2">
            <MapPin size={12} className="text-[#C5A059]" /> Accra, Ghana
          </span>
        </motion.div>

        {/* Main Name & Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            FREDA <span className="text-[#E2725B] italic">OFORI</span>
          </h1>
          <p className="text-lg sm:text-2xl font-mono text-[#C5A059] font-medium tracking-tight uppercase">
            Founder & Lead Engineer at <span className="text-gray-900 dark:text-white font-bold">Freda Creations</span>
          </p>
        </motion.div>

        {/* Kente Ribbon Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xs mx-auto my-5"
        >
          <KenteDivider />
        </motion.div>

        {/* Main Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-3xl mx-auto text-base sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-sans font-light"
        >
          "AI-assisted Software Developer & Cloud/DevOps Engineer — building and shipping production-ready systems"
        </motion.p>

        {/* Pitch */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed"
        >
          Resilient AWS & Azure cloud infrastructure, Kubernetes container orchestration, automated CI/CD pipelines, and high-impact civic tech applications with intelligent AI integrations.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo('projects')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#E2725B] hover:bg-[#E2725B]/90 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            id="hero-view-projects-btn"
          >
            <span>View Engineering Portfolio</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => scrollTo('contact')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 dark:bg-[#121212] dark:hover:bg-white/10 dark:text-gray-200 dark:border-white/15 text-xs font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer"
            id="hero-contact-btn"
          >
            <Mail size={16} className="text-[#E2725B]" />
            <span>Contact Me</span>
          </button>

          <button
            onClick={onOpenResume}
            className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-[#C5A059] dark:bg-[#121212] dark:hover:bg-white/10 dark:border-[#C5A059]/30 text-xs font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer"
            id="hero-view-cv-btn"
          >
            <Download size={16} />
            <span>View CV / Resume</span>
          </button>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="p-4 rounded-xl bg-white border border-gray-200 dark:bg-[#121212] dark:border-white/10 hover:border-[#E2725B]/50 transition-all text-left group shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Cloud size={20} className="text-[#E2725B] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-gray-500 uppercase">AWS & Infra</span>
            </div>
            <p className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase">Cloud Architecture</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">AWS, EC2, Lambda, S3, CloudFront</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 dark:bg-[#121212] dark:border-white/10 hover:border-[#C5A059]/50 transition-all text-left group shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Terminal size={20} className="text-[#C5A059] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-gray-500 uppercase">Containers</span>
            </div>
            <p className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase">DevOps & CI/CD</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">Docker, K8s, Terraform, Actions</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 dark:bg-[#121212] dark:border-white/10 hover:border-[#E2725B]/50 transition-all text-left group shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Cpu size={20} className="text-[#E2725B] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-gray-500 uppercase">Full Stack</span>
            </div>
            <p className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase">React & TypeScript</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">PWA, Firebase, Node.js, Tailwind</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 dark:bg-[#121212] dark:border-white/10 hover:border-[#C5A059]/50 transition-all text-left group shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck size={20} className="text-[#C5A059] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-gray-500 uppercase">AI Workflow</span>
            </div>
            <p className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase">AI-Assisted Dev</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">Gemini API, Amazon Q, Claude</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
