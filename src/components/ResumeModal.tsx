import React from 'react';
import { motion } from 'motion/react';
import { X, Printer, Download, MapPin, Mail, Phone, Globe, Linkedin, Github, Award, CheckCircle } from 'lucide-react';
import { NyansapoSymbol, KenteDivider } from './AdinkraMotif';

interface ResumeModalProps {
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-amber-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto overflow-hidden text-slate-900 dark:text-slate-200"
      >
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <NyansapoSymbol size={22} className="text-amber-500" />
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Freda Ofori — Curriculum Vitae
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-8 space-y-8 overflow-y-auto text-slate-800 dark:text-slate-200 text-sm print:text-black print:bg-white print:p-0">
          {/* Resume Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">FREDA OFORI</h1>
                <p className="text-sm font-mono text-amber-600 dark:text-amber-400 font-semibold mt-1">
                  Cloud & DevOps Engineer • Full-Stack Developer
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Freda Creations | Accra, Ghana</p>
              </div>

              <div className="text-xs space-y-1 font-mono text-slate-700 dark:text-slate-300">
                <p className="flex items-center gap-1.5">
                  <Mail size={13} className="text-amber-600 dark:text-amber-400" /> fredaesiofori905@gmail.com
                </p>
                <p className="flex items-center gap-1.5">
                  <Github size={13} className="text-amber-600 dark:text-amber-400" /> github.com/fredaesiofori
                </p>
                <p className="flex items-center gap-1.5">
                  <Linkedin size={13} className="text-teal-600 dark:text-teal-400" /> linkedin.com/in/freda-ofori
                </p>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Results-driven Cloud & DevOps Engineer and Full-Stack Developer with deep expertise in AWS cloud services, Docker & Kubernetes container orchestration, Infrastructure-as-Code (Terraform), and AI-assisted application workflows. Proven track record of engineering high-availability civic tech PWAs, food donation distribution networks, and serverless architectures.
            </p>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-1">
              Education
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Azubi Africa</h3>
                  <p className="text-slate-600 dark:text-slate-300">Specialization in Cloud Computing & Artificial Intelligence</p>
                </div>
                <span className="font-mono text-amber-600 dark:text-amber-400 text-[11px]">2025</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Accra Technical University</h3>
                  <p className="text-slate-600 dark:text-slate-300">BTECH Computer Science</p>
                </div>
                <span className="font-mono text-amber-600 dark:text-amber-400 text-[11px]">2021 – 2024</span>
              </div>
            </div>
          </div>

          {/* Key Skills */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-1">
              Core Technical Skills
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <strong className="text-amber-700 dark:text-amber-300 block mb-0.5">Cloud & DevOps:</strong>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">AWS (EC2, S3, Lambda, VPC, IAM, CloudFront), Docker, Kubernetes, Terraform, Prometheus, Grafana, GitHub Actions</p>
              </div>
              <div>
                <strong className="text-teal-700 dark:text-teal-300 block mb-0.5">Software & Web:</strong>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">TypeScript 5, React 19, Tailwind CSS, Node.js, Express, Firebase Firestore & Auth, Python, REST APIs, PWAs</p>
              </div>
            </div>
          </div>

          {/* Highlight Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-1">
              Key Projects
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>AlertGH — Emergency Reporting PWA</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">React, Firebase, Gemini API</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                  Built a civic tech PWA for real-time hazard reporting across Ghana using AI threat classification via Gemini API.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>Event Ticketing System on Kubernetes</span>
                  <span className="text-teal-600 dark:text-teal-400 font-mono text-[11px]">Docker, K8s, Prometheus, Grafana</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                  Engineered auto-scaling event ticketing platform on Kubernetes cluster with full Prometheus observability metrics.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>AWS Serverless Task Application</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">AWS Lambda, DynamoDB, Terraform</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                  Provisioned fully automated serverless application infrastructure using Terraform IaC scripts.
                </p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-1">
              Certifications & Badges
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <li>AWS Knowledge: Cloud Essentials – AWS Training & Certification (July 2026)</li>
              <li>AWS Knowledge: Amazon Q Developer Fundamentals – AWS Training & Certification (July 2026)</li>
              <li>Google Ads for Beginners – Coursera (June 2026)</li>
              <li>Siemens Project Manager Job Simulation – Forage (June 2026)</li>
              <li>AWS Certified Solutions Architect – Associate (2025)</li>
              <li>Azubi Africa Cloud & AI Diploma (2025)</li>
              <li>BTECH Computer Science – Accra Technical University (2024)</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
