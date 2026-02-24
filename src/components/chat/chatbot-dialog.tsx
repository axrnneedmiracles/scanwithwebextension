'use client';

import { useState } from 'react';
import { Bot, Send, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'bot' | 'user';
  content: string;
}

interface ChatBotDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ChatBotDialog({ open, onClose }: ChatBotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! I am Nayra, your Sentinel Assistant. I see you encountered a threat. How can I help you secure your digital life today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'I am currently in training mode, but I recommend checking our "What To Do" section for immediate steps. Always enable 2FA on your accounts!' },
      ]);
    }, 1000);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[100] w-80 md:w-96 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <Card className="bg-card/90 backdrop-blur-xl border-primary/40 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-primary/20 bg-primary/10">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            NAYRA Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-80 p-4">
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-full h-8 w-8 shrink-0 flex items-center justify-center ${m.role === 'bot' ? 'bg-primary/20' : 'bg-accent/20'}`}>
                    {m.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${m.role === 'bot' ? 'bg-muted/50 rounded-tl-none' : 'bg-primary text-primary-foreground rounded-tr-none'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-3 border-t border-primary/10">
          <form onSubmit={handleSend} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for advice..."
              className="bg-background/50 h-9 text-xs focus-visible:ring-primary"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
