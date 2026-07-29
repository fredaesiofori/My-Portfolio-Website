import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, ShieldCheck, Menu, X, Sparkles, MessageSquare, ChevronRight, MapPin } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onOpenChat?: () => void;
  onOpenImageStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenAdmin,
  isAdminLoggedIn,
  onOpenChat,
  onOpenImageStudio,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'projects', 'skills', 'certifications', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { num: '01', name: 'Overview', href: '#about' },
    { num: '02', name: 'Engineering', href: '#projects' },
    { num: '03', name: 'Skills', href: '#skills' },
    { num: '04', name: 'Credentials', href: '#certifications' },
    { num: '05', name: 'Blog', href: '#blog' },
    { num: '06', name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 border-b border-gray-200 text-gray-900 dark:bg-[#080808]/90 dark:border-white/10 dark:text-gray-100 backdrop-blur-md shadow-2xl'
            : 'bg-transparent border-b border-gray-200/30 dark:border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Sleek Identity Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3 group focus:outline-none"
            id="brand-logo"
          >
            <div className="w-9 h-9 bg-[#E2725B] flex items-center justify-center rounded-sm rotate-45 group-hover:scale-105 transition-transform shadow-md">
              <span className="-rotate-45 font-black text-black text-lg">F</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase text-gray-900 dark:text-white">
                Freda <span className="text-[#E2725B]">Creations</span>
              </h1>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono">
                Cloud & DevOps Engineer
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#E2725B] font-bold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  <span className="text-[#E2725B]">{link.num}.</span>
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* AI Chatbot Launch Button */}
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="px-3 py-2 min-h-[44px] bg-[#E2725B]/15 border border-[#E2725B]/40 text-[#E2725B] hover:bg-[#E2725B]/25 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Launch Gemini AI Assistant"
              >
                <MessageSquare size={14} />
                <span className="hidden md:inline">AI Chat</span>
              </button>
            )}

            {/* AI Image Studio Launch Button */}
            {onOpenImageStudio && (
              <button
                onClick={onOpenImageStudio}
                className="px-3 py-2 min-h-[44px] bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/25 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Launch Gemini AI Image Studio"
              >
                <Sparkles size={14} />
                <span className="hidden md:inline">AI Studio</span>
              </button>
            )}

            {/* Admin Badge Pill (visible when authenticated as admin) */}
            {isAdminLoggedIn && (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-2 min-h-[44px] bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-300 hover:text-teal-900 dark:hover:text-white hover:bg-teal-500/20 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                id="admin-access-btn"
                title="Access Admin Console"
              >
                <ShieldCheck size={14} className="text-teal-500 dark:text-teal-400" />
                <span className="hidden sm:inline">/admin</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-gray-100 border border-gray-300 text-gray-700 hover:text-gray-900 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:text-white hover:border-[#E2725B]/50 transition-all flex items-center justify-center cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
              id="theme-toggle-btn"
            >
              {darkMode ? <Sun size={16} className="text-[#C5A059]" /> : <Moon size={16} className="text-gray-700" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-gray-100 border border-gray-300 text-gray-700 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 hover:text-[#E2725B] flex items-center justify-center cursor-pointer"
              aria-label="Open mobile menu"
              id="mobile-menu-toggle"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Sleek Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#0d0d0d] border-l border-gray-200 dark:border-white/10 z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#E2725B] flex items-center justify-center rounded-sm rotate-45 shadow-sm">
                      <span className="-rotate-45 font-black text-black text-base">F</span>
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-tight">
                        Freda <span className="text-[#E2725B]">Creations</span>
                      </span>
                      <p className="text-[8px] font-mono uppercase text-gray-500 tracking-widest">
                        Navigation Menu
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-[#E2725B] transition-colors"
                    aria-label="Close mobile menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation Links List */}
                <nav className="mt-6 space-y-1">
                  {navLinks.map((link, idx) => {
                    const isActive = activeSection === link.href.replace('#', '');
                    return (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.25 }}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-mono transition-all ${
                          isActive
                            ? 'bg-[#E2725B]/10 text-[#E2725B] font-bold border border-[#E2725B]/30'
                            : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#E2725B]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[#E2725B] text-xs font-bold">{link.num}.</span>
                          <span>{link.name}</span>
                        </div>
                        <ChevronRight size={14} className={isActive ? 'text-[#E2725B]' : 'text-gray-400 opacity-60'} />
                      </motion.a>
                    );
                  })}
                </nav>

                {/* Quick Action Buttons Grid inside Mobile Drawer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block px-1">
                    Quick Tools & Actions
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {onOpenChat && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenChat();
                        }}
                        className="p-3 bg-[#E2725B]/10 border border-[#E2725B]/30 rounded-xl text-xs font-mono font-bold text-[#E2725B] flex flex-col items-center justify-center gap-1.5 hover:bg-[#E2725B]/20 transition-all cursor-pointer"
                      >
                        <MessageSquare size={16} />
                        <span>AI Assistant</span>
                      </button>
                    )}

                    {onOpenImageStudio && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenImageStudio();
                        }}
                        className="p-3 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl text-xs font-mono font-bold text-[#C5A059] flex flex-col items-center justify-center gap-1.5 hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                      >
                        <Sparkles size={16} />
                        <span>Image Studio</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#C5A059]" /> Accra, Ghana
                  </span>
                  <span>v2.4.0</span>
                </div>

                <div className="text-[10px] text-gray-400 font-mono text-center">
                  © {new Date().getFullYear()} Freda Creations. All rights reserved.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

