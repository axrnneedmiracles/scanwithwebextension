'use client';

import { useState, useEffect } from 'react';
import { Users, MessageCircleWarning, Star, AlertCircle, ShieldCheck, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { useCommunity } from '@/context/community-context';
import type { Report } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export interface ReportFormData {
  title: string;
  url: string;
  comment: string;
  rating: number;
}

interface CommunityPageProps {
  prefilledReport?: Partial<ReportFormData> | null;
  onFormSubmit?: () => void;
}

const ReportTime = ({ time }: { time: any }) => {
  const [formattedTime, setFormattedTime] = useState('');
  useEffect(() => {
    if (time && typeof time.toDate === 'function') {
      setFormattedTime(formatDistanceToNow(new Date(time.toDate()), { addSuffix: true }));
    } else if (time instanceof Date) {
        setFormattedTime(formatDistanceToNow(time, { addSuffix: true }));
    } else {
      setFormattedTime('Just now');
    }
  }, [time]);

  return <p className="text-muted-foreground">{formattedTime}</p>;
};

export function CommunityPage({ prefilledReport, onFormSubmit }: CommunityPageProps) {
  const { reports, addReport } = useCommunity();
  const [newReport, setNewReport] = useState<ReportFormData>({ title: '', url: '', comment: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (prefilledReport) {
      setNewReport(prev => ({ ...prev, ...prefilledReport }));
    }
  }, [prefilledReport]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReport(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value: number[]) => {
    setNewReport(prev => ({...prev, rating: value[0]}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title || !newReport.url || !newReport.comment) return;

    setIsSubmitting(true);
    addReport(newReport);
    
    // Trigger success animation
    setShowSuccess(true);
    setIsSubmitting(false);
    setNewReport({ title: '', url: '', comment: '', rating: 5 });

    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl animate-in fade-in zoom-in-95 space-y-8">
        <Card className="bg-card/30 backdrop-blur-lg border-primary/20 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-primary-foreground">
                    <Users className="text-primary w-8 h-8" />
                     Community Reports
                </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[400px] flex flex-col">
                {showSuccess ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-6 bg-accent/20 rounded-full animate-bounce">
                      <ShieldCheck className="w-16 h-16 text-accent" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-primary-foreground">Report Received!</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Your submission has been logged and is currently <span className="text-accent font-semibold">waiting for approval</span> from our security team.
                      </p>
                    </div>
                    <Button onClick={() => setShowSuccess(false)} variant="outline" className="cursor-target">
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Another Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                    <Alert className="bg-primary/10 border-primary/30 text-primary-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Moderation Policy</AlertTitle>
                      <AlertDescription>
                        All community reports are reviewed by our team before being published to prevent spam and ensure quality.
                      </AlertDescription>
                    </Alert>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary-foreground">Submit a Report</h3>
                      <div className="space-y-4">
                        <Input name="title" placeholder="Report Title (e.g. 'Phishing attempt')" value={newReport.title} onChange={handleInputChange} className="bg-input" required />
                        <Input name="url" placeholder="Malicious URL" value={newReport.url} onChange={handleInputChange} className="bg-input" required />
                        <Textarea name="comment" placeholder="Describe the scam..." value={newReport.comment} onChange={handleInputChange} className="bg-input" required/>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="rating">Your Risk Rating</Label>
                            <span className="text-primary font-bold">{newReport.rating}/10</span>
                          </div>
                          <Slider id="rating" min={1} max={10} step={1} value={[newReport.rating]} onValueChange={handleRatingChange} />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 text-lg cursor-target" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Submit for Review'}
                      </Button>
                    </form>
                  </div>
                )}
            </CardContent>
        </Card>
        
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-primary-foreground">Public Reports</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Live Feed
                </div>
             </div>
             {reports.length > 0 ? (
                reports.map((report) => (
                  <Card key={report.id} className="bg-background/50 border-border/50 transition-all hover:border-primary/40">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <CardTitle className="text-base font-bold flex items-center gap-2">
                            <MessageCircleWarning className="text-destructive w-5 h-5" />
                             {report.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground break-all">{report.url}</p>
                        </div>
                        <Avatar>
                          <AvatarFallback className="bg-secondary text-secondary-foreground">{report.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm italic">“{report.comment}”</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 text-destructive font-bold">
                        <Star className="w-4 h-4 fill-destructive text-destructive" />
                        <span>{report.rating}/10 Rating</span>
                      </div>
                      <ReportTime time={report.time} />
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-xl">
                  <p className="text-muted-foreground">No approved community reports yet. Be the first to help others!</p>
                </div>
              )}
        </div>
    </div>
  );
}
