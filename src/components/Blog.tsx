import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { BlogPost } from '../types';
import { Search, Calendar, Clock, User, Tag, ArrowRight, ArrowLeft, BookOpen, X, Sparkles, Share2, Check } from 'lucide-react';
import { KenteDivider } from './AdinkraMotif';

interface BlogProps {
  posts: BlogPost[];
  loading: boolean;
}

export const Blog: React.FC<BlogProps> = ({ posts, loading }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);

  // Collect all unique tags dynamically
  const allTags = ['All', ...Array.from(new Set(posts.flatMap((p) => p.tags || [])))];

  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag === 'All' || (post.tags && post.tags.includes(selectedTag));
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTag && matchesQuery;
  });

  const handleShare = (post: BlogPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#blog`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-white dark:bg-[#080808] border-t border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E2725B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2725B]/30 bg-[#E2725B]/10 text-[#E2725B] text-xs font-mono font-bold tracking-widest uppercase">
            <BookOpen size={14} />
            <span>05. Technical Insights & Blog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-gray-900 dark:text-white">
            Engineering <span className="text-[#E2725B] italic">Chronicles</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            Deep dives into AI-augmented DevOps, cloud architecture, Kubernetes orchestration, and Ghanaian tech innovation.
          </p>
          <KenteDivider />
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
          {/* Tag Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-all ${
                  selectedTag === tag
                    ? 'bg-[#E2725B] text-black font-bold shadow-md shadow-[#E2725B]/20'
                    : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 hover:text-[#E2725B]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles, keywords, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#080808] border border-gray-300 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#E2725B]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-xs uppercase"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#E2725B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 dark:text-gray-400 text-xs font-mono">Fetching technical articles from Firestore...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-white/10 space-y-3 shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">No articles matched your criteria.</p>
            <button
              onClick={() => {
                setSelectedTag('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#E2725B] underline hover:text-[#E2725B]/80 font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Blog Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id || post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden hover:border-[#E2725B]/40 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:shadow-[#E2725B]/5"
              >
                <div>
                  {/* Article Cover Image */}
                  {post.imageUrl && (
                    <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-black">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-85 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] via-transparent to-transparent" />
                      
                      {post.featured && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#E2725B] text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Sparkles size={11} /> Featured Read
                        </span>
                      )}
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Meta info header */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#E2725B]" />
                        {post.date}
                      </span>
                      {post.readTime && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-[#C5A059]" />
                          {post.readTime}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                        <User size={13} className="text-teal-600 dark:text-teal-500" />
                        {post.author}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setSelectedPost(post)}
                      className="text-xl font-bold leading-snug text-gray-900 dark:text-white group-hover:text-[#E2725B] transition-colors cursor-pointer"
                    >
                      {post.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2.5 py-1 rounded text-gray-700 dark:text-gray-300 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                    By {post.author}
                  </span>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#E2725B] hover:text-[#E2725B]/80 uppercase tracking-wider transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Viewer Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#E2725B]/30 rounded-xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto relative p-6 sm:p-10 shadow-2xl text-gray-900 dark:text-gray-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="sticky top-0 float-right z-20 p-2.5 rounded-full bg-gray-100 dark:bg-[#181818] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-[#E2725B] dark:hover:bg-[#E2725B] hover:text-black transition-colors shadow-md"
                title="Close Article"
              >
                <X size={20} />
              </button>

              {/* Back to Blog */}
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#E2725B] uppercase tracking-wider mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to All Articles</span>
              </button>

              {/* Cover Image if available */}
              {selectedPost.imageUrl && (
                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-8 border border-gray-200 dark:border-white/10">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] via-transparent to-transparent" />
                </div>
              )}

              {/* Meta information */}
              <div className="space-y-4 mb-8">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded">
                    <Calendar size={13} className="text-[#E2725B]" />
                    {selectedPost.date}
                  </span>
                  {selectedPost.readTime && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded">
                      <Clock size={13} className="text-[#C5A059]" />
                      {selectedPost.readTime}
                    </span>
                  )}
                  <button
                    onClick={() => handleShare(selectedPost)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#E2725B]/10 text-[#E2725B] border border-[#E2725B]/30 rounded hover:bg-[#E2725B]/20 transition-colors ml-auto"
                  >
                    {copied ? <Check size={13} /> : <Share2 size={13} />}
                    <span>{copied ? 'Copied Link' : 'Share'}</span>
                  </button>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white tracking-tight">
                  {selectedPost.title}
                </h1>

                {/* Author Card */}
                <div className="flex items-center gap-4 py-4 px-5 bg-slate-50 dark:bg-[#181818] border-l-4 border-[#E2725B] rounded-r-lg">
                  <div className="w-10 h-10 rounded-full bg-[#E2725B] flex items-center justify-center font-bold text-black text-lg">
                    FO
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{selectedPost.author}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {selectedPost.authorRole || 'Cloud & DevOps Engineer • Accra, Ghana'}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedPost.tags?.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-3 py-1 bg-[#E2725B]/10 border border-[#E2725B]/30 text-[#E2725B] rounded-md"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Article Content Rendered with Markdown */}
              <div className="markdown-body border-t border-gray-200 dark:border-white/10 pt-8 text-gray-800 dark:text-gray-300 text-sm sm:text-base leading-relaxed space-y-6">
                <Markdown>{selectedPost.content}</Markdown>
              </div>

              {/* Bottom Footer Actions */}
              <div className="mt-12 pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500 font-mono">
                  Written by <span className="text-gray-900 dark:text-gray-300 font-bold">{selectedPost.author}</span> • Freda Creations
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2.5 bg-[#E2725B] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#E2725B]/90 transition-colors"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
