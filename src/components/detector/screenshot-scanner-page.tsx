
'use client';

import { useState } from 'react';
import { Camera, ShieldAlert, ShieldCheck, Loader2, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { scanScreenshot } from '@/lib/screenshot-actions';
import type { ScreenshotAnalysisResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function ScreenshotScannerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScreenshotAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
        return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const dataUri = reader.result as string;
            const analysis = await scanScreenshot(dataUri);
            setResult(analysis);
            setAnalyzing(false);
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not process the image.' });
        setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in-95">
        <Card className="bg-card/30 backdrop-blur-lg border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-primary-foreground">
                    <Camera className="text-primary w-8 h-8" />
                    Screenshot Scam Scanner
                </CardTitle>
                <CardDescription>Upload a screenshot of a suspicious message to detect fraud, scams, or phishing attempts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl p-8 bg-background/20">
                    {result?.imageUrl ? (
                        <div className="relative w-full max-w-sm aspect-[9/16] mb-4 rounded-lg overflow-hidden border border-primary/20">
                            <Image src={result.imageUrl} alt="Screenshot for analysis" fill className="object-contain" />
                        </div>
                    ) : (
                        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                    )}
                    <input
                        type="file"
                        id="screenshot-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={analyzing}
                    />
                    <Button asChild disabled={analyzing} className="cursor-target h-12 px-8 text-lg">
                        <label htmlFor="screenshot-upload">
                            {analyzing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Camera className="mr-2 h-5 w-5" />}
                            {analyzing ? 'Analyzing Message...' : 'Upload Screenshot'}
                        </label>
                    </Button>
                </div>

                {result && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className={`flex items-center justify-between p-6 rounded-xl border-2 transition-colors ${result.isScam ? 'bg-destructive/10 border-destructive/50' : 'bg-accent/10 border-accent/50'}`}>
                            <div className="flex items-center gap-4">
                                {result.isScam ? <ShieldAlert className="text-destructive w-12 h-12" /> : <ShieldCheck className="text-accent w-12 h-12" />}
                                <div>
                                    <h3 className={`text-2xl font-black uppercase tracking-tighter ${result.isScam ? 'text-destructive' : 'text-accent'}`}>
                                        {result.isScam ? 'Threat Detected' : 'Likely Safe'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Fraud Risk Score: {result.riskScore}/100</p>
                                </div>
                            </div>
                            <Badge variant={result.isScam ? 'destructive' : 'default'} className={`text-lg px-4 py-1 ${!result.isScam ? 'bg-accent' : ''}`}>
                                 {result.riskScore}%
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground font-bold">Scam Probability</span>
                                <span className="font-bold">{result.riskScore}%</span>
                            </div>
                            <Progress value={result.riskScore} className="h-3" />
                        </div>

                        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                            <AccordionItem value="item-1" className="border-border/50">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <AlertTriangle className="mr-2 text-primary" />
                                    Analysis Verdict
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                    {result.explanation}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-border/50">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <ShieldAlert className="mr-2 text-destructive" />
                                    Recommended Actions
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                    {result.recommendedActions}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-border/50">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <FileText className="mr-2 text-accent" />
                                    Extracted Content
                                </AccordionTrigger>
                                <AccordionContent className="text-sm bg-muted/30 p-4 rounded-md font-mono whitespace-pre-wrap">
                                    {result.extractedText}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
