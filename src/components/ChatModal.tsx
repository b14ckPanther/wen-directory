'use client';

import React, { useState } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/context/ChatContext';

const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

export default function ChatModal() {
  const { isChatOpen, closeChat } = useChat();
  const [messages, setMessages] = useState<string[]>([
    "بدك تعرف وين تلاقي اللي براسك؟ بسيطة… اسألني وأنا بساعدك!",
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 right-3 w-[95%] sm:w-80 md:w-96 h-[70vh] max-h-[550px] bg-gradient-to-b from-[#0B132B]/95 to-[#1B2A41]/95 backdrop-blur-xl border border-gold/30 rounded-2xl shadow-[0_8px_30px_rgba(255,215,0,0.15)] flex flex-col z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gold text-navy rounded-t-2xl shadow-md">
            <div className="flex items-center gap-2 font-bold">
              <Bot size={20} />
              <span>WenBot - مساعدك الذكي</span>
            </div>
            <button onClick={closeChat} className="hover:scale-110 transition">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-2xl max-w-[75%] shadow-md break-words ${i % 2 === 0 ? "bg-gold/10 text-gold self-start border border-gold/30" : "bg-navy/80 text-gray self-end border border-gray/30"} ${isArabic(msg) ? "font-sans" : "font-dancing"}`}
              >
                {msg}
              </motion.div>
            ))}
          </div>
          <div className="p-3 border-t border-gold/20 flex items-center gap-2">
            <div className="relative flex-1">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="اكتب رسالتك..." className="w-full bg-[#0B132B]/80 border border-gold/40 rounded-full px-4 py-2 text-sm text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition" />
              <button onClick={handleSend} className="absolute left-1 top-1/2 -translate-y-1/2 bg-gradient-to-br from-gold to-yellow-500 text-navy p-2 rounded-full shadow-md hover:scale-110 transition">
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}