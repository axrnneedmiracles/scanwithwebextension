'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Loader2, ShieldAlert, Phone, Landmark, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { nayraChat } from '@/ai/flows/nayra-chat-flow';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'bot' | 'user';
  content: string;
}

interface ChatBotDialogProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_OPTIONS = [
  { id: 'scammed', label: "I've been scammed", icon: <ShieldAlert className="w-3 h-3" /> },
  { id: 'bank', label: "Bank Support", icon: <Landmark className="w-3 h-3" /> },
  { id: 'report', label: "Report Scam", icon: <Phone className="w-3 h-3" /> },
  { id: 'tips', label: "Security Tips", icon: <HelpCircle className="w-3 h-3" /> },
];

/**
 * Helper to parse text and turn URLs into clickable <a> tags.
 */
function formatMessageContent(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline break-all font-bold"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export function ChatBotDialog({ open, onClose }: ChatBotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I am Nayra, your Sentinel Forensic Assistant. If you've encountered a scam, I'm here to help you recover.\n\nWhat happened? Please tell me which bank was involved and the approximate amount lost." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        content: m.content
      }));

      const response = await nayraChat({
        message: text,
        history: history.slice(0, -1)
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.reply }]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Nayra is offline',
        description: 'Forensic connection lost. Please retry.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[100] w-[90vw] md:w-[420px] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <Card className="bg-card/95 backdrop-blur-2xl border-primary/40 shadow-[0_0_50px_rgba(103,58,183,0.3)] flex flex-col h-[550px] rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-primary/20 bg-primary/20">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-primary rounded-xl">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm font-black tracking-widest uppercase">
                NAYRA FORENSIC
              </CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Active Session</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-destructive/20 hover:text-destructive">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-grow overflow-hidden p-0 relative">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-lg h-8 w-8 shrink-0 flex items-center justify-center ${m.role === 'bot' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                    {m.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap max-w-[85%] ${
                    m.role === 'bot' 
                      ? 'bg-muted/50 rounded-tl-none border border-border/30 text-foreground' 
                      : 'bg-primary text-primary-foreground rounded-tr-none'
                  }`}>
                    {formatMessageContent(m.content)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="p-2 rounded-lg h-8 w-8 bg-primary/20 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 rounded-tl-none italic text-xs text-muted-foreground">
                    Nayra is typing...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex flex-col p-4 border-t border-primary/10 bg-muted/5 gap-3">
          <div className="flex flex-wrap gap-2 w-full">
            {QUICK_OPTIONS.map((opt) => (
              <Button 
                key={opt.id} 
                variant="outline" 
                size="sm" 
                onClick={() => sendMessage(opt.label)}
                disabled={loading}
                className="h-8 text-[11px] rounded-full border-primary/20 bg-background/50 hover:bg-primary/10 hover:border-primary/40 cursor-target flex items-center gap-1.5"
              >
                {opt.icon}
                {opt.label}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell Nayra what happened..."
              className="bg-background/80 h-10 text-sm border-primary/20 rounded-xl"
              disabled={loading}
            />
            <Button type="submit" size="icon" className="h-10 w-10 shrink-0 bg-primary rounded-xl" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
