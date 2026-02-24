'use client';

import { useCommunity } from '@/context/community-context';
import { Shield, Trash2, LogOut, MessageCircleWarning, Star, Users, ScanSearch, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useAdmin } from '@/context/admin-context';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAnalytics } from '@/hooks/use-analytics';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

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

export default function AdminPage() {
  const { pendingReports, reports, approveReport, deleteReport } = useCommunity();
  const { logout } = useAdmin();
  const { stats, loading } = useAnalytics();

  return (
    <div className="w-full max-w-3xl animate-in fade-in zoom-in-95 space-y-8">
        <Card className="bg-card/30 backdrop-blur-lg border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-2xl text-primary-foreground">
                        <Shield className="text-primary w-8 h-8" />
                        Admin Panel
                    </CardTitle>
                    <CardDescription>Manage community reports and view analytics.</CardDescription>
                </div>
                <Button variant="ghost" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-background/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.totalVisits}</div>
                        <p className="text-xs text-muted-foreground">Total site visits</p>
                    </CardContent>
                </Card>
                <Card className="bg-background/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                        <ScanSearch className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.totalScans}</div>
                        <p className="text-xs text-muted-foreground">Total messages scanned</p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

        {/* Pending Reports Section */}
        <Card className="w-full max-w-3xl bg-card/30 backdrop-blur-lg border-yellow-500/20">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-yellow-500">
                    <Clock className="w-6 h-6" />
                    Pending Approval ({pendingReports.length})
                </CardTitle>
                <CardDescription>Reports submitted by users that need review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {pendingReports.length > 0 ? (
                    pendingReports.map((report) => (
                    <Card key={report.id} className="bg-background/50 border-yellow-500/20 shadow-sm shadow-yellow-500/5">
                        <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <MessageCircleWarning className="text-yellow-500 w-5 h-5" />
                                {report.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground break-all">{report.url}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => approveReport(report.id)} className="border-accent text-accent hover:bg-accent/10">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Reject Report?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the report.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteReport(report.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <p className="text-sm">“{report.comment}”</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                            <Star className="w-4 h-4 fill-yellow-500" />
                            <span>{report.rating}/10 Rating</span>
                        </div>
                        <ReportTime time={report.time} />
                        </CardFooter>
                    </Card>
                    ))
                ) : (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground">No pending reports to review.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Live Reports Section */}
        <Card className="w-full max-w-3xl bg-card/30 backdrop-blur-lg border-primary/20">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-primary-foreground">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    Live Community Reports ({reports.length})
                </CardTitle>
                <CardDescription>Reports currently visible to all users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                {reports.length > 0 ? (
                    reports.map((report) => (
                    <Card key={report.id} className="bg-background/50 border-border/50 opacity-80">
                        <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <MessageCircleWarning className="text-destructive w-5 h-5" />
                                {report.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground break-all">{report.url}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-accent/20 text-accent">Live</Badge>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Remove from Community?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action will permanently delete this approved report.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteReport(report.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <p className="text-sm">“{report.comment}”</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1 text-destructive font-bold">
                            <Star className="w-4 h-4 fill-destructive" />
                            <span>{report.rating}/10 Rating</span>
                        </div>
                        <ReportTime time={report.time} />
                        </CardFooter>
                    </Card>
                    ))
                ) : (
                    <div className="text-center py-6">
                    <p className="text-muted-foreground">No approved reports yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
