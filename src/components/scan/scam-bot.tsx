'use client';

import { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { ChatBotDialog } from '../chat/chatbot-dialog';
import { Button } from '../ui/button';

export function ScamBot() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[90]">
        <Button 
          onClick={() => setChatOpen(true)}
          className="group relative h-16 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(132,0,255,0.4)] border-2 border-white/20 transition-all hover:scale-105 active:scale-95 cursor-target flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping group-hover:animate-none" />
            <Bot className="w-6 h-6 relative z-10" />
          </div>
          <span className="text-lg">ASK NAYRA</span>
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          
          {/* Subtle Glow */}
          <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>

      <ChatBotDialog open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
