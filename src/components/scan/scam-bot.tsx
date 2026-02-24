'use client';

import { useState } from 'react';
import { ChatBotDialog } from '../chat/chatbot-dialog';

export function ScamBot() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-center pointer-events-none">
        {/* Robot Container */}
        <div className="relative w-48 h-48 md:w-72 md:h-72 overflow-hidden pointer-events-auto flex items-center justify-center rounded-3xl group">
          {/* @ts-ignore */}
          <spline-viewer 
            url="https://prod.spline.design/QnT-ySBgwfivAi4p/scene.splinecode"
            className="w-full h-full"
            loading-anim-type="spinner-small-dark"
          ></spline-viewer>
          
          {/* ASK NAYRA Button - Positioned to cover the watermark and act as the primary CTA */}
          <button 
            onClick={() => setChatOpen(true)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-8 py-2.5 bg-primary text-primary-foreground text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(132,0,255,0.5)] border border-white/20 hover:scale-110 active:scale-95 transition-all z-[100] cursor-target whitespace-nowrap backdrop-blur-md hover:bg-primary/90"
          >
            ASK NAYRA
          </button>
          
          {/* Subtle overlay to help hide watermark edges if needed */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        </div>
      </div>

      <ChatBotDialog open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
