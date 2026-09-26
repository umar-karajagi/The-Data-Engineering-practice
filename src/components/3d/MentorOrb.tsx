'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  Zap, 
  Terminal,
  Brain
} from 'lucide-react';
import { useUserStore } from '../../lib/userStore';

interface MentorOrbProps {
  activeTopic?: string;
}

export const MentorOrb: React.FC<MentorOrbProps> = ({ activeTopic = 'Distributed Data Engineering' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [userQuery, setUserQuery] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ sender: 'mentor' | 'user'; text: string }>>([
    {
      sender: 'mentor',
      text: `Hello! I am your DataForge AI Architect. Currently analyzing: ${activeTopic}. Ask me anything about partition layouts, shuffle bottlenecks, or query optimization.`
    }
  ]);

  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = () => {
    if (!userQuery.trim()) return;
    const query = userQuery.trim();
    setUserQuery('');

    const newMsgs = [...messages, { sender: 'user' as const, text: query }];
    setMessages(newMsgs);

    // Context-sensitive engineering heuristics
    let reply = `In production ${activeTopic}, always isolate skew before scaling workers. Verify partition count aligns with spark.sql.shuffle.partitions (default 200) and check spill to disk.`;
    
    if (query.toLowerCase().includes('sql') || query.toLowerCase().includes('window')) {
      reply = `For SQL performance: ensure predicate pushdown is active. When using Window Functions, partition on high-cardinality keys and minimize ORDER BY sort spills in tempdb.`;
    } else if (query.toLowerCase().includes('iceberg') || query.toLowerCase().includes('delta') || query.toLowerCase().includes('lakehouse')) {
      reply = `In Lakehouse tables (Iceberg/Delta): small files kill scan latency. Run bin-pack compaction regularly, partition by date/month, and use Z-Order on columns frequently in WHERE clauses.`;
    } else if (query.toLowerCase().includes('interview') || query.toLowerCase().includes('stage 9')) {
      reply = `In interviews: always state your throughput assumptions (e.g. 50k events/sec = 50MB/s), choose storage formats (Parquet with Snappy), and walk through fault tolerance when nodes crash.`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'mentor', text: reply }]);
      speakText(reply);
    }, 600);
  };

  return (
    <>
      {/* Floating Holographic Summon Orb */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-brand-blue to-purple-600 p-0.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center cursor-pointer group"
          title="Summon AI Data Mentor"
        >
          {/* Animated Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-emerald-400 blur-md opacity-40 group-hover:opacity-80 transition-opacity animate-pulse" />
          
          <div className="relative w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white">
            <Bot className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
            
            {/* Live Pulsing Equalizer Bars */}
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex items-center gap-0.5 bg-emerald-500 text-black px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold animate-bounce">
                <span className="w-1 h-2 bg-black rounded-full animate-pulse" />
                <span className="w-1 h-3 bg-black rounded-full animate-pulse delay-75" />
                <span className="w-1 h-1.5 bg-black rounded-full animate-pulse delay-150" />
              </span>
            )}
          </div>
        </motion.button>
      </div>

      {/* Floating Mentor Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-slate-900/95 border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-500/20 backdrop-blur-xl overflow-hidden flex flex-col max-h-[520px]"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>AI Senior Staff Mentor</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 truncate max-w-[180px]">
                    Context: {activeTopic}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={soundEnabled ? 'Mute Speech' : 'Enable Speech'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs custom-scrollbar">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl ${
                    m.sender === 'mentor'
                      ? 'bg-slate-950/90 border border-emerald-500/20 text-slate-200'
                      : 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-200 ml-4'
                  }`}
                >
                  <div className="text-[9px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    {m.sender === 'mentor' ? '🤖 Mentor' : '👤 You'}
                  </div>
                  <div className="leading-relaxed">{m.text}</div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask an architecture question..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
