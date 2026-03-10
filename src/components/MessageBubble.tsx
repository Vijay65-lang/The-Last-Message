import React, { useEffect, useState } from 'react';
import { Message } from '../game/engine';
import { motion } from 'motion/react';
import { Check, CheckCheck } from 'lucide-react';

export const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isPlayer = message.sender === 'player';
  const isSystem = message.sender === 'system';
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isSystem) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex justify-center my-2"
      >
        <div className="bg-[#182229] text-amber-500/90 text-xs px-3 py-1.5 rounded-lg border border-amber-900/30 text-center max-w-[85%] uppercase tracking-wider font-mono shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          {message.text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col max-w-[80%] ${isPlayer ? 'self-end' : 'self-start'}`}
    >
      <div 
        className={`px-3 py-2 rounded-2xl shadow-sm relative transition-all duration-500 ${
          isPlayer 
            ? 'bg-[#005c4b] text-zinc-100 rounded-tr-none' 
            : 'bg-[#202c33] text-zinc-100 rounded-tl-none'
        } ${isNew && !isPlayer ? 'shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/20' : 'border border-transparent'}`}
      >
        {message.image && (
          <div className="mb-2 rounded-xl overflow-hidden border border-zinc-700/50">
            <img src={message.image} alt="Attachment" className="w-full h-auto object-cover max-h-48" referrerPolicy="no-referrer" />
          </div>
        )}
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        <div className={`text-[10px] text-zinc-400 mt-1 flex justify-end items-center gap-1`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isPlayer && (
            <span className="ml-1">
              {message.status === 'read' ? (
                <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
              ) : (
                <Check className="w-4 h-4 text-zinc-400" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
