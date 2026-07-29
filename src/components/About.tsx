import React from 'react';
import { motion } from 'motion/react';
import { SankofaSymbol, KenteDivider } from './AdinkraMotif';
import { GraduationCap, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const education = [
    {
      institution: 'Azubi Africa',
      program: 'Cloud Computing & AI Specialization',
      status: 'Current Cohort',
      focus: 'AWS Infrastructure, DevOps Pipelines, Microservices & Generative AI Integration',
      period: '2025'
    },
    {
      institution: 'Accra Technical University',
      program: 'BTECH Computer Science',
      status: 'Graduated',
      focus: 'Data Structures, Software Engineering, Network Administration & Database Systems',
      period: '2026'
    }
  ];

  const aiWorkflowTools = [
    { name: 'Google AI Studio', role: 'Rapid AI Prototyping & Gemini API Grounding' },
    { name: 'Amazon Q Developer', role: 'AWS Cloud Architecture & Code Acceleration' },
    { name: 'Claude 3.5 Sonnet', role: 'Deep Algorithmic Refactoring & Test Generation' },
    { name: 'Prompt Engineering', role: 'Structured System Instructions & Context Optimization' }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white dark:bg-[#080808] border-t border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2725B]/40 bg-[#E2725B]/10 text-[#E2725B] text-xs font-mono font-bold tracking-widest uppercase">
            <SankofaSymbol size={16} />
            <span>01. Wisdom & Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-gray-900 dark:text-white">
            About <span className="text-[#E2725B] italic">Freda Ofori</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Engineered with precision. Driven by impact. Built with modern cloud tools.
          </p>
          <KenteDivider />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed"
          >
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 space-y-4 shadow-xl relative overflow-hidden">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <span className="text-[#E2725B]">Akwaaba!</span> Cloud & DevOps Engineer.
              </h3>

              <p>
                My passion lies at the intersection of <strong className="text-gray-900 dark:text-white">robust cloud architecture</strong>, <strong className="text-[#E2725B]">DevOps automation</strong>, and <strong className="text-[#C5A059]">AI-assisted full-stack development</strong>. Under my brand, <em className="text-[#E2725B] font-medium not-italic">Freda Creations</em>, I design, build, and deploy production-ready systems — from serverless functions to fully containerized microservices — applying the same rigor whether the traffic is ten users or ten thousand.
              </p>

              <p>
                I build software that doesn't flinch under load — serverless architectures on AWS and Azure, containerized deployments on Kubernetes, CI/CD pipelines that ship with confidence, and monitoring that catches problems before users do. Engineered to hold, not just to demo.
              </p>

              <blockquote className="text-gray-600 dark:text-gray-400 text-xs italic border-l-2 border-[#E2725B] pl-4 py-1 bg-gray-100 dark:bg-white/5 rounded-r">
                "I treat AI-assisted development as a force multiplier, not a shortcut — every line still gets reviewed, tested, and deployed as it matters. I measure success in uptime, not demos."
              </blockquote>
            </div>

            {/* AI Workflow Card */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#121212] border border-[#E2725B]/30 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#E2725B] font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={16} />
                  <span>AI-Assisted Development Workflow</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#E2725B]/10 text-[#E2725B] border border-[#E2725B]/30 uppercase font-bold">
                  High Productivity
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                Leveraging state-of-the-art AI developer tools to accelerate architecture design, automate code refactoring, enforce strict type safety, and fast-track deployment cycles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {aiWorkflowTools.map((tool) => (
                  <div key={tool.name} className="p-3 rounded-lg bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/10 flex items-start gap-2.5 shadow-sm">
                    <CheckCircle2 size={16} className="text-[#E2725B] mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{tool.name}</h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400">{tool.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Education */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-3">
                <GraduationCap size={18} />
                <span>Education & Credentials</span>
              </div>

              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.institution} className="p-4 rounded-lg bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/10 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{edu.institution}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#E2725B]">{edu.program}</p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-normal">{edu.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#E2725B]/10 border border-[#E2725B]/30 text-[#E2725B]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase">Accra, Ghana</h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400">Available for Remote & On-Site Engineering Collaborations</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/10 shadow-sm">
                  <span className="block text-xl font-bold text-[#E2725B] font-mono">6+</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Cloud Systems</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/10 shadow-sm">
                  <span className="block text-xl font-bold text-[#C5A059] font-mono">AWS & K8s</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">Core Stack</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
