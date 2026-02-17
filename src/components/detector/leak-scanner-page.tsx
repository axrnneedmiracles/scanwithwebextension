'use client';

import { useState } from 'react';
import { MailSearch, ShieldAlert, ShieldCheck, Loader2, AlertCircle, Key, Globe, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { checkEmailLeak } from '@/lib/leak-actions';
import type { LeakedDBResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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
                <CardTitle className="text-2xl font-bold text-primary-foreground">Leaked DB Scan</CardTitle>
                <CardDescription className="text-lg">Scan your email in leaked database or if ur email is leaked or not.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 bg-background/50 border-primary/30 text-lg pl-4 focus-visible:ring-accent"
                            disabled={scanning}
                            required
                        />
                    </div>
                    <Button type="submit" size="lg" className="h-14 px-8 text-lg font-bold cursor-target" disabled={scanning}>
                        {scanning ? <Loader2 className="mr-2 animate-spin" /> : <Globe className="mr-2" />}
                        {scanning ? 'Scanning...' : 'Scan Now'}
                    </Button>
                </form>

                {scanning && (
                    <div className="mt-12 text-center space-y-4 animate-pulse">
                        <div className="flex justify-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <p className="text-muted-foreground font-mono text-sm">SEARCHING BREACH REPOSITORIES...</p>
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
                                    <h3 className={`text-3xl font-black uppercase tracking-tighter ${result.isFound ? 'text-destructive' : 'text-accent'}`}>
                                        {result.isFound ? `${result.breachCount} Breaches Found` : 'No Leaks Detected'}
                                    </h3>
                                    <p className="text-muted-foreground">Checked on {new Date(result.analyzedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className={`text-xl px-6 py-2 border-2 ${getRiskColor(result.riskLevel)}`}>
                                 Risk: {result.riskLevel}
                            </Badge>
                        </div>

                        {result.isFound && (
                            <div className="grid grid-cols-1 gap-4">
                                {result.breaches.map((breach, index) => (
                                    <Card key={index} className="bg-background/40 border-primary/10 p-6">
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-xl font-bold text-primary-foreground">{breach.name}</h4>
                                                    <Badge variant="outline" className="text-xs">{breach.date}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{breach.description}</p>
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {breach.dataTypes.map((type, i) => (
                                                        <Badge key={i} variant="secondary" className="text-[10px] uppercase">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <AlertCircle className="text-destructive w-6 h-6 shrink-0" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        <Card className="bg-primary/5 border-primary/10">
                            <CardHeader className="py-4 px-6 border-b border-primary/20">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Key className="w-4 h-4 text-primary" />
                                    Recommended Security Steps
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {result.recommendations}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <div className="flex justify-center gap-8 text-xs text-muted-foreground opacity-50">
            <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> Fast Analysis</div>
            <div className="flex items-center gap-2"><Globe className="w-3 h-3" /> Global Database</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Secure Search</div>
        </div>
    </div>
  );
}
