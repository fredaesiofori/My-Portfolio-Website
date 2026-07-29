import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { ExternalLink, Github, Filter, Search, Sparkles, Layers, Eye, X, Code2, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { KenteDivider } from './AdinkraMotif';

interface ProjectsProps {
  projects: Project[];
  loading: boolean;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTechTag, setSelectedTechTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [focusedProjectIndex, setFocusedProjectIndex] = useState<number>(-1);

  const categories = ['All', 'Cloud & DevOps', 'Full-Stack & PWA', 'AI & Civic Tech', 'Serverless'];

  // Extract all unique tech stack tags from the Firestore projects array dynamically
  const availableTechTags = useMemo(() => {
    const tagsSet = new Set<string>();
    projects.forEach((p) => {
      p.techStack?.forEach((tech) => {
        tagsSet.add(tech);
      });
    });
    return ['All', ...Array.from(tagsSet)];
  }, [projects]);

  // Dynamic filtering based on category, technology tag, and search keywords
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      const tagQuery = selectedTechTag.toLowerCase().trim();
      const matchesTech =
        selectedTechTag === 'All' ||
        project.category.toLowerCase().includes(tagQuery) ||
        project.techStack?.some(
          (t) =>
            t.toLowerCase() === tagQuery ||
            t.toLowerCase().includes(tagQuery) ||
            tagQuery.includes(t.toLowerCase())
        );

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.techStack?.some((tech) => tech.toLowerCase().includes(q));

      return matchesCategory && matchesTech && matchesQuery;
    });
  }, [projects, selectedCategory, selectedTechTag, searchQuery]);

  // Keyboard navigation event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in a text field
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        if (e.key === 'Escape' && activeProjectModal) {
          setActiveProjectModal(null);
        }
        return;
      }

      if (filteredProjects.length === 0) return;

      if (activeProjectModal) {
        // Modal navigation mode
        const currentIndex = filteredProjects.findIndex((p) => (p.id || p.title) === (activeProjectModal.id || activeProjectModal.title));
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % filteredProjects.length;
          setActiveProjectModal(filteredProjects[nextIndex]);
          setFocusedProjectIndex(nextIndex);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
          setActiveProjectModal(filteredProjects[prevIndex]);
          setFocusedProjectIndex(prevIndex);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setActiveProjectModal(null);
        }
      } else {
        // Grid navigation mode
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedProjectIndex((prev) => (prev + 1) % filteredProjects.length);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedProjectIndex((prev) => (prev <= 0 ? filteredProjects.length - 1 : prev - 1));
        } else if ((e.key === 'Enter' || e.key === ' ') && focusedProjectIndex >= 0 && focusedProjectIndex < filteredProjects.length) {
          e.preventDefault();
          setActiveProjectModal(filteredProjects[focusedProjectIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredProjects, activeProjectModal, focusedProjectIndex]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2725B]/30 bg-[#E2725B]/10 text-[#E2725B] text-xs font-mono font-bold tracking-widest uppercase">
            <Layers size={14} />
            <span>03. Engineering Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-gray-900 dark:text-white">
            Featured <span className="text-[#E2725B] italic">Systems & Apps</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            Production cloud infrastructure, AI-augmented PWA applications, and containerized Kubernetes services.
          </p>
          <KenteDivider />
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="mb-10 space-y-4 bg-white dark:bg-[#121212] p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl">
          {/* Top Row: Search Input & Tech Tag Dropdown */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by title, description, or stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-[#080808] border border-gray-300 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#E2725B]/70"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-mono uppercase"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Tech Stack Dropdown Filter */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <Tag size={15} className="text-[#C5A059] shrink-0" />
              <label className="text-xs text-gray-600 dark:text-gray-400 font-mono uppercase shrink-0">Tech Tag:</label>
              <select
                value={selectedTechTag}
                onChange={(e) => setSelectedTechTag(e.target.value)}
                className="bg-slate-50 dark:bg-[#080808] text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#E2725B] w-full md:w-48 cursor-pointer"
              >
                {availableTechTags.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech === 'All' ? '⚡ All Technologies' : `• ${tech}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Tags Row */}
          <div className="pt-2 border-t border-gray-200 dark:border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mr-1 flex items-center gap-1">
              <Tag size={12} className="text-[#C5A059]" /> Quick Tags:
            </span>
            {['Cloud', 'DevOps', 'Full-Stack', 'Kubernetes', 'Docker', 'Firebase', 'React', 'AI'].map((tag) => {
              const isActive = selectedTechTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTechTag(isActive ? 'All' : tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A059] text-black font-extrabold shadow-md shadow-[#C5A059]/20 scale-105'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-[#C5A059]/20 hover:text-[#C5A059] border border-gray-300 dark:border-white/10'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {/* Category Pill Buttons */}
          <div className="pt-2 border-t border-gray-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mr-1">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#E2725B] text-black font-bold shadow-md shadow-[#E2725B]/20'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/5 hover:text-[#E2725B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Active Filter Indicators / Clear Filters Button */}
            {(selectedCategory !== 'All' || selectedTechTag !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTechTag('All');
                  setSearchQuery('');
                }}
                className="text-xs font-mono text-[#E2725B] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
              >
                <X size={12} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Project Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#E2725B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 text-xs font-mono">Fetching project portfolio from Firestore...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-[#121212] rounded-xl border border-white/10 space-y-3">
            <p className="text-gray-300 text-sm font-medium">No projects found matching your search and filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedTechTag('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#E2725B] underline hover:text-[#E2725B]/80 font-bold uppercase tracking-wider"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => {
              const isFocused = focusedProjectIndex === idx;
              return (
                <motion.div
                  key={project.id || project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => {
                    setFocusedProjectIndex(idx);
                    setActiveProjectModal(project);
                  }}
                  tabIndex={0}
                  onFocus={() => setFocusedProjectIndex(idx)}
                  className={`group bg-white dark:bg-gradient-to-br dark:from-[#181818] dark:to-[#0f0f0f] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-out flex flex-col justify-between shadow-lg relative ${
                    isFocused
                      ? 'border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-2xl shadow-[#C5A059]/25 -translate-y-1.5'
                      : 'border-gray-200 dark:border-white/10 hover:border-[#C5A059] hover:ring-1 hover:ring-[#C5A059]/40 hover:shadow-2xl hover:shadow-[#C5A059]/20 hover:-translate-y-2.5'
                  }`}
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden bg-black">
                      <img
                        src={
                          project.imageUrl ||
                          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent dark:from-[#0f0f0f]" />

                      {/* Category Label */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#080808]/90 text-[#E2725B] border border-[#E2725B]/30 backdrop-blur-md">
                        {project.category}
                      </span>

                      {project.featured && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 backdrop-blur-md flex items-center gap-1">
                          <Sparkles size={11} /> Featured
                        </span>
                      )}
                    </div>

                    {/* Body Info */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#E2725B] transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.techStack?.map((tech) => (
                          <button
                            key={tech}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTechTag(tech);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-colors ${
                              selectedTechTag === tech
                                ? 'bg-[#E2725B] text-black border-[#E2725B] font-bold'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-white/10 hover:border-[#E2725B]/40 hover:text-[#E2725B]'
                            }`}
                          >
                            #{tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="p-5 pt-0 border-t border-white/5 mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded bg-[#E2725B]/10 hover:bg-[#E2725B]/20 text-[#E2725B] border border-[#E2725B]/30 text-xs font-bold uppercase tracking-tight flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink size={13} /> Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-bold uppercase tracking-tight flex items-center gap-1.5 transition-colors"
                        >
                          <Github size={13} /> Source
                        </a>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedProjectIndex(idx);
                        setActiveProjectModal(project);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-gray-300 bg-white/5 hover:bg-[#E2725B]/20 hover:text-white border border-white/10 group-hover:border-[#E2725B]/40 group-hover:bg-[#E2725B]/10 group-hover:text-[#E2725B] transition-all duration-300 ease-out flex items-center gap-1.5 shadow-sm group-hover:px-3.5 group/btn"
                      title="View Details"
                    >
                      <Eye size={14} className="text-[#E2725B] transition-transform duration-300 group-hover/btn:scale-110 shrink-0" />
                      <span className="max-w-0 group-hover:max-w-28 opacity-0 group-hover:opacity-100 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px] font-bold uppercase tracking-wider">
                        View Details
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Modal Details */}
      <AnimatePresence>
        {activeProjectModal && (() => {
          const currentIndex = filteredProjects.findIndex(
            (p) => (p.id || p.title) === (activeProjectModal.id || activeProjectModal.title)
          );
          const hasPrev = filteredProjects.length > 1;
          const hasNext = filteredProjects.length > 1;

          const handlePrev = () => {
            const nextIdx = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
            setActiveProjectModal(filteredProjects[nextIdx]);
            setFocusedProjectIndex(nextIdx);
          };

          const handleNext = () => {
            const nextIdx = (currentIndex + 1) % filteredProjects.length;
            setActiveProjectModal(filteredProjects[nextIdx]);
            setFocusedProjectIndex(nextIdx);
          };

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
              onClick={() => setActiveProjectModal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#E2725B]/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative shadow-2xl text-gray-900 dark:text-gray-100"
              >
                {/* Modal Header Bar with Keyboard Navigation Hints */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-0.5 rounded bg-[#E2725B]/15 text-[#E2725B] font-bold border border-[#E2725B]/30">
                      {currentIndex + 1} / {filteredProjects.length}
                    </span>
                    <span className="hidden sm:inline text-[11px] text-gray-500">
                      Use <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-gray-700 dark:text-gray-300 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-gray-700 dark:text-gray-300 font-mono">→</kbd> Arrow keys to navigate • <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-gray-700 dark:text-gray-300 font-mono">Esc</kbd> to close
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {hasPrev && (
                      <button
                        onClick={handlePrev}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-[#E2725B] hover:text-black text-gray-700 dark:text-gray-300 transition-colors"
                        title="Previous Project (Left Arrow)"
                      >
                        <ChevronLeft size={18} />
                      </button>
                    )}
                    {hasNext && (
                      <button
                        onClick={handleNext}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-[#E2725B] hover:text-black text-gray-700 dark:text-gray-300 transition-colors"
                        title="Next Project (Right Arrow)"
                      >
                        <ChevronRight size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => setActiveProjectModal(null)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/15 transition-colors ml-1"
                      title="Close (Esc)"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="relative h-56 rounded-lg overflow-hidden bg-black border border-gray-200 dark:border-white/10">
                  <img
                    src={
                      activeProjectModal.imageUrl ||
                      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={activeProjectModal.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded text-xs font-mono font-bold bg-[#080808]/90 text-[#E2725B] border border-[#E2725B]/40">
                    {activeProjectModal.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{activeProjectModal.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{activeProjectModal.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#E2725B] mb-2">
                    Architecture & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProjectModal.techStack?.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded text-xs font-mono bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-500">
                    Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-gray-700 dark:text-gray-300">←</kbd> / <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-gray-700 dark:text-gray-300">→</kbd> to cycle
                  </span>

                  <div className="flex items-center gap-3">
                    {activeProjectModal.githubUrl && (
                      <a
                        href={activeProjectModal.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-gray-300 dark:border-white/10"
                      >
                        <Github size={15} /> Source Code
                      </a>
                    )}
                    {activeProjectModal.liveUrl && (
                      <a
                        href={activeProjectModal.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded bg-[#E2725B] hover:bg-[#E2725B]/90 text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md"
                      >
                        <ExternalLink size={15} /> Launch App
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
};
