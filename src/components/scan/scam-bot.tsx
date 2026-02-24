'use client';

import { useState } from 'react';
import { ChatBotDialog } from '../chat/chatbot-dialog';

export function ScamBot() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-center pointer-events-none">
        {/* Robot Container */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 overflow-hidden pointer-events-auto flex items-center justify-center rounded-3xl group">
          {/* @ts-ignore */}
          <spline-viewer 
            url="https://prod.spline.design/rYPxO8ZKJCM6ipWR/scene.splinecode"
            className="w-full h-full"
            loading-anim-type="spinner-small-dark"
          ></spline-viewer>
          
          {/* ASK NAYRA Button - Positioned specifically to cover the Spline watermark */}
          <button 
            onClick={() => setChatOpen(true)}
            className="absolute bottom-2 right-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(132,0,255,0.6)] border-2 border-white/20 hover:scale-105 active:scale-95 transition-all z-[100] cursor-target whitespace-nowrap backdrop-blur-md hover:bg-primary/90"
          >
            ASK NAYRA
          </button>
        </div>
      </div>

      <ChatBotDialog open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
