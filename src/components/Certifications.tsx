import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { Certification } from '../types';
import { KenteDivider } from './AdinkraMotif';
import { Award, ExternalLink, Calendar, ShieldCheck, Eye, X, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface CertificationsProps {
  certifications: Certification[];
  loading: boolean;
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const Certifications: React.FC<CertificationsProps> = ({ certifications, loading }) => {
  const [selectedCertModal, setSelectedCertModal] = useState<Certification | null>(null);
  const [focusedCertIndex, setFocusedCertIndex] = useState<number>(-1);

  // Keyboard navigation event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textareas
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        if (e.key === 'Escape' && selectedCertModal) {
          setSelectedCertModal(null);
        }
        return;
      }

      if (certifications.length === 0) return;

      if (selectedCertModal) {
        // Modal mode navigation
        const currentIndex = certifications.findIndex(
          (c) => (c.id || c.title) === (selectedCertModal.id || selectedCertModal.title)
        );

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % certifications.length;
          setSelectedCertModal(certifications[nextIndex]);
          setFocusedCertIndex(nextIndex);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + certifications.length) % certifications.length;
          setSelectedCertModal(certifications[prevIndex]);
          setFocusedCertIndex(prevIndex);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setSelectedCertModal(null);
        }
      } else {
        // Grid mode keyboard navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedCertIndex((prev) => (prev + 1) % certifications.length);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedCertIndex((prev) => (prev <= 0 ? certifications.length - 1 : prev - 1));
        } else if ((e.key === 'Enter' || e.key === ' ') && focusedCertIndex >= 0 && focusedCertIndex < certifications.length) {
          e.preventDefault();
          setSelectedCertModal(certifications[focusedCertIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certifications, selectedCertModal, focusedCertIndex]);

  return (
    <section id="certifications" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with entrance animation */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2725B]/40 bg-[#E2725B]/10 text-[#E2725B] text-xs font-mono font-bold tracking-widest uppercase">
            <Award size={16} />
            <span>04. Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-gray-900 dark:text-white">
            Certifications & <span className="text-[#E2725B] italic">Degrees</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Formal qualifications, AWS accreditations, and specialized Cloud & AI diplomas.
          </p>
          <KenteDivider />
        </motion.div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#E2725B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 dark:text-gray-400 text-xs font-mono">Loading credentials from Firestore...</p>
          </div>
        ) : certifications.length === 0 ? (
          <div className="py-12 text-center bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-white/10">
            <p className="text-gray-600 dark:text-gray-400 text-sm">No certifications found in database yet.</p>
          </div>
        ) : (
          /* Staggered Certifications Gallery Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {certifications.map((cert, idx) => {
              const isFocused = focusedCertIndex === idx;
              return (
                <motion.div
                  key={cert.id ? `cert-${cert.id}` : `cert-${idx}-${cert.title}`}
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2, ease: 'easeOut' } }}
                  onClick={() => {
                    setFocusedCertIndex(idx);
                    setSelectedCertModal(cert);
                  }}
                  tabIndex={0}
                  onFocus={() => setFocusedCertIndex(idx)}
                  className={`group p-5 rounded-xl bg-white dark:bg-[#121212] border transition-all duration-300 ease-out flex flex-col justify-between shadow-lg relative overflow-hidden cursor-pointer ${
                    isFocused
                      ? 'border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-2xl shadow-[#C5A059]/25 scale-[1.02]'
                      : 'border-gray-200 dark:border-white/10 hover:border-[#C5A059] hover:ring-1 hover:ring-[#C5A059]/40 hover:shadow-2xl hover:shadow-[#C5A059]/20'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Thumbnail Cover */}
                    <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900 border border-gray-200 dark:border-white/10">
                      <img
                        src={
                          cert.imageUrl ||
                          'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={cert.title}
                        className={`w-full h-full ${
                          cert.imageUrl?.endsWith('.svg') ? 'object-contain p-2' : 'object-cover'
                        } group-hover:scale-105 transition-transform duration-500`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                      
                      {/* Verified Badge Checkmark */}
                      {cert.credentialUrl && (
                        <div
                          className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-sm text-[#10B981] border border-[#10B981]/40 flex items-center gap-1 text-[10px] font-mono font-bold tracking-wide shadow-md"
                          title="Verified Credential Available"
                        >
                          <BadgeCheck size={13} className="text-[#10B981]" />
                          <span>Verified</span>
                        </div>
                      )}

                      <div className="absolute top-2.5 right-2.5 p-1.5 rounded bg-black/80 text-[#C5A059] border border-white/10 group-hover:bg-[#E2725B] group-hover:text-black transition-colors">
                        <Eye size={14} />
                      </div>
                    </div>

                    {/* Title & Issuer */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 uppercase tracking-tight group-hover:text-[#E2725B] transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#E2725B] mt-1">{cert.issuer}</p>
                    </div>
                  </div>

                  {/* Footer Metadata */}
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-[11px] font-mono">
                      <Calendar size={12} className="text-[#C5A059]" />
                      {cert.issueDate}
                    </span>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#E2725B] hover:underline font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider"
                      >
                        Verify <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Certificate Detail Modal */}
      <AnimatePresence>
        {selectedCertModal && (() => {
          const currentIndex = certifications.findIndex(
            (c) => (c.id || c.title) === (selectedCertModal.id || selectedCertModal.title)
          );
          const hasPrev = certifications.length > 1;
          const hasNext = certifications.length > 1;

          const handlePrev = () => {
            const nextIdx = (currentIndex - 1 + certifications.length) % certifications.length;
            setSelectedCertModal(certifications[nextIdx]);
            setFocusedCertIndex(nextIdx);
          };

          const handleNext = () => {
            const nextIdx = (currentIndex + 1) % certifications.length;
            setSelectedCertModal(certifications[nextIdx]);
            setFocusedCertIndex(nextIdx);
          };

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedCertModal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#121212] border border-[#E2725B]/40 rounded-xl max-w-2xl w-full p-6 space-y-5 relative shadow-2xl text-gray-100 max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header Bar with Keyboard Navigation Hints */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <ShieldCheck size={16} className="text-[#E2725B]" />
                    <span className="px-2 py-0.5 rounded bg-[#E2725B]/15 text-[#E2725B] font-bold border border-[#E2725B]/30">
                      {currentIndex + 1} / {certifications.length}
                    </span>
                    <span className="hidden sm:inline text-[11px] text-gray-500">
                      Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-300 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-300 font-mono">→</kbd> Arrow keys • <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-300 font-mono">Esc</kbd> to close
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {hasPrev && (
                      <button
                        onClick={handlePrev}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#E2725B] hover:text-black text-gray-300 transition-colors"
                        title="Previous Credential (Left Arrow)"
                      >
                        <ChevronLeft size={18} />
                      </button>
                    )}
                    {hasNext && (
                      <button
                        onClick={handleNext}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#E2725B] hover:text-black text-gray-300 transition-colors"
                        title="Next Credential (Right Arrow)"
                      >
                        <ChevronRight size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCertModal(null)}
                      className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/15 transition-colors ml-1"
                      title="Close (Esc)"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">{selectedCertModal.title}</h3>
                  <p className="text-xs text-[#C5A059] font-semibold mt-1">Issued by {selectedCertModal.issuer}</p>
                </div>

                <div className="relative h-72 sm:h-96 rounded-lg overflow-hidden bg-black/80 border border-white/10 my-2 flex items-center justify-center p-2">
                  <img
                    src={
                      selectedCertModal.imageUrl ||
                      'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={selectedCertModal.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                  <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#C5A059]" />
                    Issue Date: {selectedCertModal.issueDate}
                  </span>

                  {selectedCertModal.credentialUrl && (
                    <a
                      href={selectedCertModal.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-lg bg-[#E2725B] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#c95d46] transition-colors shadow-md"
                    >
                      Verify Official Credential <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
};
