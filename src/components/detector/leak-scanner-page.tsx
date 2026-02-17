'use client';

import { useState } from 'react';
import { MailSearch, ShieldAlert, ShieldCheck, Loader2, AlertCircle, Key, Globe, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { checkEmailLeak } from '@/lib/leak-actions';
import type { LeakedDBResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

export function LeakScannerPage() {
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<LeakedDBResult | null>(null);
  const { toast } = useToast();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
        toast({ variant: 'destructive', title: 'Invalid Email', description: 'Please enter a valid email address.' });
        return;
    }

    setScanning(true);
    setResult(null);

    try {
        const data = await checkEmailLeak(email);
        setResult(data);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Scan Failed', description: error.message });
    } finally {
        setScanning(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
        case 'Critical': return 'text-destructive border-destructive bg-destructive/10';
        case 'High': return 'text-orange-500 border-orange-500 bg-orange-500/10';
        case 'Medium': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
        default: return 'text-accent border-accent bg-accent/10';
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in zoom-in-95">
        <Card className="bg-card/30 backdrop-blur-lg border-primary/20">
            <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <MailSearch className="text-primary w-10 h-10" />
                </div>
                <CardTitle className="text-3xl font-black tracking-tight text-primary-foreground">Leaked DB Forensic Scan</CardTitle>
                <CardDescription className="text-lg">Cross-reference your email against 12+ billion compromised records from global data breaches.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Input 
                            type="email" 
                            placeholder="your-email@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 bg-background/50 border-primary/30 text-lg pl-4 focus-visible:ring-accent"
                            disabled={scanning}
                            required
                        />
                    </div>
                    <Button type="submit" size="lg" className="h-14 px-8 text-lg font-bold cursor-target" disabled={scanning}>
                        {scanning ? <Loader2 className="mr-2 animate-spin" /> : <Globe className="mr-2" />}
                        {scanning ? 'Searching Dark Web...' : 'Scan Now'}
                    </Button>
                </form>

                {scanning && (
                    <div className="mt-12 text-center space-y-4 animate-pulse">
                        <div className="flex justify-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <p className="text-muted-foreground font-mono text-sm">QUERYING SHADOW REPOSITORIES...</p>
                    </div>
                )}

                {result && (
                    <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                        <div className={`p-8 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${result.isFound ? 'bg-destructive/5 border-destructive/20' : 'bg-accent/5 border-accent/20'}`}>
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-full ${result.isFound ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'}`}>
                                    {result.isFound ? <ShieldAlert className="w-12 h-12" /> : <ShieldCheck className="w-12 h-12" />}
                                </div>
                                <div>
                                    <h3 className={`text-4xl font-black uppercase tracking-tighter ${result.isFound ? 'text-destructive' : 'text-accent'}`}>
                                        {result.isFound ? `Found ${result.breachCount} Breaches` : 'Account is Secure'}
                                    </h3>
                                    <p className="text-muted-foreground text-lg">Scan completed on: {new Date(result.analyzedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className={`text-xl px-6 py-2 border-2 ${getRiskColor(result.riskLevel)}`}>
                                 Risk: {result.riskLevel}
                            </Badge>
                        </div>

                        {result.isFound && (
                            <div className="grid grid-cols-1 gap-6">
                                {result.breaches.map((breach, index) => (
                                    <Card key={index} className="bg-background/40 border-primary/10 hover:border-primary/30 transition-all p-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <ShieldAlert className="w-16 h-16" />
                                        </div>
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                            <div className="space-y-4 max-w-2xl">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-2xl font-bold text-primary-foreground">{breach.name}</h4>
                                                    <Badge className="bg-destructive/20 text-destructive border-destructive/20">{breach.date}</Badge>
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed italic">"{breach.description}"</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {breach.dataTypes.map((type, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs bg-muted/50 border border-white/5 uppercase">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive min-w-[140px]">
                                                <AlertCircle className="w-8 h-8" />
                                                <span className="text-sm font-bold uppercase tracking-widest">Exposed</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        <Card className="bg-primary/5 border-primary/10 overflow-hidden">
                            <CardHeader className="bg-primary/10 py-4 px-6 border-b border-primary/20">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Key className="w-5 h-5 text-primary" />
                                    Next Action Steps
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-primary-foreground text-lg leading-relaxed">
                                    {result.recommendations}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
        <div className="text-center p-8 bg-background/30 rounded-2xl border border-primary/10 flex flex-col items-center gap-4">
            <h4 className="text-xl font-bold text-muted-foreground">About Leaked DB forensic scan</h4>
            <p className="max-w-2xl mx-auto text-sm text-muted-foreground leading-relaxed">
                Our AI-powered engine cross-references your email with massive repositories of confirmed global data breaches. This includes deep-web dumps, pastes, and forensic database archives spanning from 2010 to present.
            </p>
            <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Clock className="w-4 h-4" /> Real-time Query
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Globe className="w-4 h-4" /> Global Coverage
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <ShieldCheck className="w-4 h-4" /> Secure Hash
                </div>
            </div>
        </div>
    </div>
  );
}
