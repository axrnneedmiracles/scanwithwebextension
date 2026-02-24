'use client';

import { useState } from 'react';
import { ChatBotDialog } from '../chat/chatbot-dialog';

export function ScamBot() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[90] group flex flex-col items-center pointer-events-none">
        {/* Floating Label */}
        <div 
          onClick={() => setChatOpen(true)}
          className="mb-[-20px] px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 cursor-pointer pointer-events-auto border border-white/20 hover:scale-105"
        >
          Need Help?
        </div>

        {/* Transparent Robo Video */}
        <div className="relative w-32 h-32 md:w-48 md:h-48 overflow-visible pointer-events-auto">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(132,0,255,0.4)]"
          >
            <source src="/robo.mp4" type="video/mp4" />
            {/* Fallback if browser doesn't support transparency well in MP4 */}
          </video>
        </div>
      </div>

      <ChatBotDialog open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
