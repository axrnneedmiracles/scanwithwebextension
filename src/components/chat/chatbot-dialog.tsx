'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
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

export function ChatBotDialog({ open, onClose }: ChatBotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! I am Nayra, your Sentinel Assistant. I am here to help you secure your digital life. Have you encountered a threat or been scammed? Tell me what happened.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessageText } as Message];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        content: m.content
      }));

      const response = await nayraChat({
        message: userMessageText,
        history: history.slice(0, -1) // Send history excluding the latest user message
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.reply }]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Nayra is offline',
        description: 'Connection error. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[100] w-[90vw] md:w-[450px] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <Card className="bg-card/95 backdrop-blur-2xl border-primary/40 shadow-[0_0_50px_rgba(103,58,183,0.3)] flex flex-col h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-primary/20 bg-primary/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
              <div className="relative p-2 bg-primary rounded-full">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <CardTitle className="text-sm font-black tracking-widest uppercase">
                NAYRA AI
              </CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Security Expert Online</span>
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
                  <div className={`p-2 rounded-full h-8 w-8 shrink-0 flex items-center justify-center ${m.role === 'bot' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                    {m.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap max-w-[85%] ${
                    m.role === 'bot' 
                      ? 'bg-muted/50 rounded-tl-none border border-border/30' 
                      : 'bg-primary text-primary-foreground rounded-tr-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 animate-pulse">
                  <div className="p-2 rounded-full h-8 w-8 bg-primary/20 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 rounded-tl-none italic text-xs text-muted-foreground flex items-center gap-2">
                    Nayra is analyzing forensics...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t border-primary/10 bg-muted/10">
          <form onSubmit={handleSend} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell Nayra what happened..."
              className="bg-background/80 h-12 text-sm focus-visible:ring-primary border-primary/20"
              disabled={loading}
            />
            <Button type="submit" size="icon" className="h-12 w-12 shrink-0 bg-primary shadow-lg shadow-primary/20" disabled={loading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
