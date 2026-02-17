'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, ShieldAlert, ShieldCheck, Loader2, PhoneCall, AlertTriangle, FileText, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { scanCall } from '@/lib/call-actions';
import type { CallAnalysisResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function CallScannerPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CallAnalysisResult | null>(null);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        chunks.current = [];

        mediaRecorder.current.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.current.push(e.data);
        };

        mediaRecorder.current.onstop = async () => {
            const blob = new Blob(chunks.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = async () => {
                const dataUri = reader.result as string;
                processAudio(dataUri);
            };
            reader.readAsDataURL(blob);
        };

        mediaRecorder.current.start();
        setIsRecording(true);
        setRecordTime(0);
        timerRef.current = setInterval(() => {
            setRecordTime(prev => prev + 1);
        }, 1000);
    } catch (err) {
        toast({
            variant: 'destructive',
            title: 'Microphone Error',
            description: 'Please allow microphone access to use this feature.',
        });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
        mediaRecorder.current.stop();
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processAudio = async (dataUri: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
        const analysis = await scanCall(dataUri);
        setResult(analysis);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not process the audio.' });
    } finally {
        setAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in-95">
        <Card className="bg-card/30 backdrop-blur-lg border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-primary-foreground">
                    <PhoneCall className="text-primary w-8 h-8" />
                    On-Call Scam Detection
                </CardTitle>
                <CardDescription>Record a suspicious call or message. Our AI will transcribe and analyze it for social engineering and fraudulent requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl p-12 bg-background/20">
                    <div className={`relative mb-8 flex items-center justify-center`}>
                         {isRecording && (
                            <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping" />
                         )}
                         <div className={`p-8 rounded-full border-4 ${isRecording ? 'border-destructive bg-destructive/10' : 'border-primary bg-primary/10'}`}>
                            {isRecording ? <Volume2 className="w-12 h-12 text-destructive animate-pulse" /> : <Mic className="w-12 h-12 text-primary" />}
                         </div>
                    </div>

                    <div className="text-center space-y-4">
                        {isRecording ? (
                            <div className="space-y-2">
                                <p className="text-2xl font-mono font-bold text-destructive">{formatTime(recordTime)}</p>
                                <p className="text-sm text-muted-foreground">Recording... Say the suspicious part clearly.</p>
                            </div>
                        ) : (
                             <p className="text-sm text-muted-foreground">Click below to start listening. Keep it under 60 seconds.</p>
                        )}
                        
                        <div className="flex justify-center gap-4">
                            {!isRecording ? (
                                <Button onClick={startRecording} disabled={analyzing} className="h-14 px-8 text-lg cursor-target">
                                    <Mic className="mr-2 h-5 w-5" />
                                    Start Detection
                                </Button>
                            ) : (
                                <Button onClick={stopRecording} variant="destructive" className="h-14 px-8 text-lg cursor-target">
                                    <Square className="mr-2 h-5 w-5" />
                                    Stop &amp; Analyze
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {analyzing && (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <p className="text-lg font-medium animate-pulse">Transcribing & Inspecting Dialogue...</p>
                    </div>
                )}

                {result && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className={`flex items-center justify-between p-6 rounded-xl border-2 transition-colors ${result.isScam ? 'bg-destructive/10 border-destructive/50' : 'bg-accent/10 border-accent/50'}`}>
                            <div className="flex items-center gap-4">
                                {result.isScam ? <ShieldAlert className="text-destructive w-12 h-12" /> : <ShieldCheck className="text-accent w-12 h-12" />}
                                <div>
                                    <h3 className={`text-2xl font-black uppercase tracking-tighter ${result.isScam ? 'text-destructive' : 'text-accent'}`}>
                                        {result.isScam ? 'Fraud Detected' : 'No Threat Found'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Vishing Risk Score: {result.riskScore}/100</p>
                                </div>
                            </div>
                            <Badge variant={result.isScam ? 'destructive' : 'default'} className={`text-lg px-4 py-1 ${!result.isScam ? 'bg-accent' : ''}`}>
                                 {result.riskScore}%
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground font-bold">Risk Level</span>
                                <span className="font-bold">{result.riskScore}%</span>
                            </div>
                            <Progress value={result.riskScore} className="h-3" />
                        </div>

                        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                            <AccordionItem value="item-1" className="border-border/50">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <AlertTriangle className="mr-2 text-primary" />
                                    Forensic Verdict
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                    {result.explanation}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-border/50">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <ShieldAlert className="mr-2 text-destructive" />
                                    Security Instructions
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                    {result.recommendedActions}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-border/50">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <FileText className="mr-2 text-accent" />
                                    Call Transcript
                                </AccordionTrigger>
                                <AccordionContent className="text-sm bg-muted/30 p-4 rounded-md font-mono whitespace-pre-wrap">
                                    {result.transcript}
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