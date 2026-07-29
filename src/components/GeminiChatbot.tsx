import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { MessageSquare, Send, Bot, User, Sparkles, X, RefreshCw, ChevronDown, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImageStudio?: () => void;
}

const ROLES = [
  {
    id: 'portfolio',
    title: "Freda's Portfolio Guide",
    instruction: "You are Freda Ofori's AI Portfolio Assistant. Freda is a Cloud & DevOps Engineer and Full-Stack Developer with expertise in AWS, Terraform, Docker, Kubernetes, CI/CD, React, and Afrofuturist digital craft. Help visitors learn about her projects, AWS certifications, Siemens PM simulation, and achievements.",
    icon: Sparkles
  },
  {
    id: 'cloud',
    title: "Cloud & DevOps Advisor",
    instruction: "You are an expert Cloud & DevOps Technical Advisor representing Freda Ofori. Answer technical questions on AWS architecture, Kubernetes, Terraform IaC, CI/CD pipelines, microservices, and serverless deployments with deep technical rigor.",
    icon: Bot
  }
];

const SUGGESTED_PROMPTS = [
  "What are Freda's core AWS certifications?",
  "Tell me about her Siemens PM Job Simulation.",
  "What tech stack does Freda use for Full-Stack apps?",
  "How can I contact Freda for cloud consulting?"
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ isOpen, onClose, onOpenImageStudio }) => {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: "Greetings! I am **Freda Ofori's AI Assistant**. Ask me anything about Freda's Cloud & DevOps projects, AWS certifications, technical skills, or Afrofuturist engineering vision!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Map for server API endpoint
      const payloadMessages = updatedMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          systemInstruction: selectedRole.instruction
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to communicate with Gemini chatbot.');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.text || "I apologize, but I didn't get a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `**Notice:** ${err.message || 'Unable to connect to Gemini AI backend.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation reset. I am in **${selectedRole.title}** mode. How can I assist you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-4 right-4 z-50 flex flex-col bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#E2725B]/40 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          expanded
            ? 'w-[92vw] sm:w-[600px] h-[85vh]'
            : 'w-[92vw] sm:w-[420px] h-[580px]'
        }`}
      >
        {/* Header */}
        <div className="bg-slate-100 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:via-[#141414] dark:to-[#1A1A1A] p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E2725B]/15 text-[#E2725B] border border-[#E2725B]/30">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">Freda AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#E2725B]/20 text-[#E2725B] text-[10px] font-mono font-bold uppercase">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Multi-turn AI Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onOpenImageStudio && (
              <button
                onClick={onOpenImageStudio}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#C5A059] dark:hover:text-[#C5A059] hover:bg-gray-200 dark:hover:bg-white/5 transition-colors text-xs font-mono flex items-center gap-1 mr-1"
                title="Open AI Image Studio"
              >
                <Sparkles size={14} className="text-[#C5A059]" />
                <span className="hidden sm:inline">Image Studio</span>
              </button>
            )}
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-colors"
              title="Clear history"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-colors hidden sm:block"
              title={expanded ? "Minimize" : "Expand"}
            >
              {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-colors"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* System Instruction / Role Selector */}
        <div className="bg-slate-50 dark:bg-[#121212] px-4 py-2 border-b border-gray-200 dark:border-white/5 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400 font-mono text-[11px]">Role Mode:</span>
          <div className="flex gap-1.5">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRole(r);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedRole.id === r.id
                    ? 'bg-[#E2725B] text-black font-bold shadow'
                    : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/10'
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-[#0A0A0A]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-[#E2725B]/15 border border-[#E2725B]/30 flex items-center justify-center text-[#E2725B] shrink-0 mt-0.5">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#E2725B] text-black font-medium rounded-tr-none'
                    : 'bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-tl-none'
                }`}
              >
                <div className="markdown-body">
                  <Markdown>{msg.text}</Markdown>
                </div>
                <div
                  className={`text-[9px] font-mono mt-1.5 text-right ${
                    msg.role === 'user' ? 'text-black/60' : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-700 dark:text-white shrink-0 mt-0.5">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-[#E2725B]/15 border border-[#E2725B]/30 flex items-center justify-center text-[#E2725B] shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E2725B] animate-ping" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">Gemini is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        {messages.length < 4 && (
          <div className="px-3 py-2 bg-white dark:bg-[#0F0F0F] border-t border-gray-200 dark:border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSend(promptText)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-[#E2725B]/20 hover:border-[#E2725B]/40 border border-gray-200 dark:border-white/10 text-[11px] text-gray-700 dark:text-gray-300 transition-all shrink-0"
              >
                {promptText}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-slate-100 dark:bg-[#121212] border-t border-gray-200 dark:border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Freda's AI Assistant..."
              className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E2725B] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#E2725B] text-black font-bold hover:bg-[#c95d46] disabled:opacity-40 disabled:hover:bg-[#E2725B] transition-colors shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
