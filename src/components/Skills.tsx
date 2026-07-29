import React from 'react';
import { motion } from 'motion/react';
import { SkillCategory } from '../types';
import { KenteDivider, NyansapoSymbol } from './AdinkraMotif';
import { Code2, Cloud, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export const Skills: React.FC = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Languages & Frameworks',
      description: 'Modern front-end, back-end runtime environments, and core web standards',
      icon: 'code',
      skills: [
        { name: 'TypeScript 5', level: 'Advanced', highlight: true },
        { name: 'React 19 / Next.js', level: 'Advanced', highlight: true },
        { name: 'Tailwind CSS', level: 'Advanced', highlight: true },
        { name: 'Node.js & Express', level: 'Proficient' },
        { name: 'Python', level: 'Proficient' },
        { name: 'JavaScript (ES6+)', level: 'Advanced' },
        { name: 'HTML5 & Responsive CSS', level: 'Expert' }
      ]
    },
    {
      title: 'Cloud Services (AWS & Azure)',
      description: 'Production-grade cloud architecture, serverless execution, multi-cloud & network routing',
      icon: 'cloud',
      skills: [
        { name: 'AWS EC2 & Auto Scaling', level: 'Advanced', highlight: true },
        { name: 'AWS S3 & CloudFront CDN', level: 'Advanced', highlight: true },
        { name: 'AWS Lambda & Azure Functions', level: 'Advanced', highlight: true },
        { name: 'Microsoft Azure Services', level: 'Proficient', highlight: true },
        { name: 'AWS IAM & Security Rules', level: 'Proficient' },
        { name: 'AWS VPC & Azure VNet', level: 'Proficient' },
        { name: 'DynamoDB & Firestore', level: 'Proficient' },
        { name: 'AWS Route 53 & DNS', level: 'Proficient' }
      ]
    },
    {
      title: 'DevOps & Infrastructure',
      description: 'Containerization, IaC provisioning, observability stacks, and automated pipelines',
      icon: 'terminal',
      skills: [
        { name: 'Docker & Microservices', level: 'Advanced', highlight: true },
        { name: 'Kubernetes (K8s) & Helm', level: 'Proficient', highlight: true },
        { name: 'Terraform (IaC)', level: 'Proficient', highlight: true },
        { name: 'GitHub Actions CI/CD', level: 'Advanced', highlight: true },
        { name: 'Prometheus & Grafana', level: 'Proficient' },
        { name: 'Linux Server Admin & Bash', level: 'Advanced' },
        { name: 'Git & Trunk Development', level: 'Expert' }
      ]
    },
    {
      title: 'AI-Assisted Development',
      description: 'Cutting-edge AI developer workflows, prompt engineering, and LLM integrations',
      icon: 'sparkles',
      skills: [
        { name: 'Google AI Studio & Gemini API', level: 'Advanced', highlight: true },
        { name: 'Amazon Q Developer', level: 'Proficient', highlight: true },
        { name: 'Claude 3.5 Sonnet / Antigravity', level: 'Advanced', highlight: true },
        { name: 'Prompt Engineering & Rules', level: 'Advanced', highlight: true },
        { name: 'GitHub Copilot', level: 'Proficient' },
        { name: 'AI Grounding & RAG Patterns', level: 'Proficient' }
      ]
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code2 size={20} className="text-[#E2725B]" />;
      case 'cloud':
        return <Cloud size={20} className="text-[#C5A059]" />;
      case 'terminal':
        return <Terminal size={20} className="text-[#E2725B]" />;
      case 'sparkles':
        return <Sparkles size={20} className="text-[#C5A059]" />;
      default:
        return <Code2 size={20} className="text-[#E2725B]" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-white dark:bg-[#080808] border-t border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2725B]/40 bg-[#E2725B]/10 text-[#E2725B] text-xs font-mono font-bold tracking-widest uppercase">
            <NyansapoSymbol size={16} />
            <span>04. Technical Competencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-gray-900 dark:text-white">
            Engineering <span className="text-[#E2725B] italic">Skills & Tooling</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Cloud infrastructure, modern DevOps automation, and AI-driven acceleration.
          </p>
          <KenteDivider />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-8 rounded-xl bg-slate-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 hover:border-[#E2725B]/50 transition-all shadow-xl space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/10 shrink-0 shadow-sm">
                  {getIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">{cat.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              {/* Skill Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-gray-200 dark:border-white/10">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className={`p-2.5 rounded-lg border transition-all flex items-center justify-between shadow-sm ${
                      skill.highlight
                        ? 'bg-white dark:bg-[#080808] border-[#E2725B]/40'
                        : 'bg-white dark:bg-[#080808] border-gray-200 dark:border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className={skill.highlight ? 'text-[#E2725B]' : 'text-[#C5A059]'}
                      />
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase">{skill.level}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
