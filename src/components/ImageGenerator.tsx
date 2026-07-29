import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Sparkles, Download, Eye, X, Loader2, Ratio, Maximize, AlertCircle } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PROMPTS = [
  "Afrofuturist Cloud Data Center with glowing gold Adinkra symbols and neon lighting",
  "Cyberpunk Accra Smart City skyline with solar towers and holographic cloud networks",
  "3D metallic gold AWS Cloud Architect certification emblem on dark obsidian background",
  "Futuristic African software engineer coding with holographic multi-screen interface"
];

const ASPECT_RATIOS = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Landscape (16:9)', value: '16:9' },
  { label: 'Standard (4:3)', value: '4:3' },
  { label: 'Portrait (9:16)', value: '9:16' }
];

const RESOLUTIONS: ('1K' | '2K' | '4K')[] = ['1K', '2K', '4K'];

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size,
          aspectRatio
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image.');
      }

      const newImg: GeneratedImage = {
        id: `img-${Date.now()}`,
        prompt: prompt.trim(),
        imageUrl: data.imageUrl,
        size: data.size || size,
        aspectRatio: data.aspectRatio || aspectRatio,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setGallery(prev => [newImg, ...prev]);
      setSelectedImage(newImg);
    } catch (err: any) {
      console.error("Image generation error:", err);
      setError(err.message || 'Error generating image.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a');
    a.href = img.imageUrl;
    a.download = `freda-ai-gen-${img.size}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#C5A059]/40 rounded-2xl max-w-4xl w-full p-5 sm:p-7 space-y-6 relative shadow-2xl text-gray-900 dark:text-gray-100 max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Gemini High-Resolution Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Afrofuturist AI Image Generator
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Generate ultra high-quality images powered by Gemini (1K, 2K, and 4K resolutions).
            </p>
          </div>

          {/* Prompt Form */}
          <div className="space-y-4 bg-slate-50 dark:bg-[#141414] p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-white/10">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                Image Description / Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your visual concept in detail (e.g., '3D metallic gold Adinkra symbol hovering over a neon Cloud Server architecture')..."
                rows={3}
                className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
              />
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">Sample Concept Prompts:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(p)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/40 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-all text-left shadow-xs"
                  >
                    "{p.substring(0, 42)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Row: Resolution (1K, 2K, 4K) & Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-white/10">
              {/* Resolution Selector (1K, 2K, 4K) */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                  Image Resolution / Quality
                </label>
                <div className="flex gap-2">
                  {RESOLUTIONS.map((resOption) => (
                    <button
                      key={resOption}
                      type="button"
                      onClick={() => setSize(resOption)}
                      className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        size === resOption
                          ? 'bg-[#C5A059] text-black shadow-lg'
                          : 'bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {resOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5 flex items-center gap-1">
                  <Ratio size={12} /> Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      type="button"
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`py-2 px-2 rounded-lg text-[11px] font-semibold transition-all text-center ${
                        aspectRatio === ratio.value
                          ? 'bg-[#E2725B] text-black font-bold'
                          : 'bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600 dark:text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Generate Action */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2725B] to-[#C5A059] text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-40 transition-all shadow-lg cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generating {size} Image via Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate {size} Image</span>
                </>
              )}
            </button>
          </div>

          {/* Latest Preview or Gallery */}
          {selectedImage && (
            <div className="space-y-3 bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#C5A059] uppercase flex items-center gap-1.5">
                  <Eye size={14} /> Generated Preview ({selectedImage.size})
                </span>
                <button
                  onClick={() => handleDownload(selectedImage)}
                  className="px-3 py-1.5 rounded-lg bg-[#E2725B] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#c95d46] transition-colors cursor-pointer"
                >
                  <Download size={14} /> Download {selectedImage.size}
                </button>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-black border border-gray-200 dark:border-white/10 max-h-[420px] flex items-center justify-center p-2">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="max-h-[400px] w-auto object-contain rounded"
                />
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 italic">"{selectedImage.prompt}"</p>
            </div>
          )}

          {/* Session Gallery */}
          {gallery.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 uppercase">Recent Studio Creations ({gallery.length})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`cursor-pointer group relative rounded-lg overflow-hidden border transition-all ${
                      selectedImage?.id === img.id
                        ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40'
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30'
                    }`}
                  >
                    <img src={img.imageUrl} alt={img.prompt} className="w-full h-24 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <span className="text-[10px] font-mono text-white bg-black/80 px-2 py-0.5 rounded border border-white/20">
                        {img.size}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
