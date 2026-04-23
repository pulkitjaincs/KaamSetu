"use client";

import { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Eye, XCircle, FileCheck, MapPin, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/utils/index';
import { Application, PaginatedApplicationsResponse } from '@/types';

import { useApplications, useWithdrawApplication } from '@/hooks/queries/useApplications';
import ApplicationStats from '@/components/worker/ApplicationStats';
import ApplicationPipeline from '@/components/worker/ApplicationPipeline';

const ApplicationDetailModal = lazy(() => import('@/components/modals/ApplicationDetailModal'));

export default function MyApplicationsPage() {
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    useEffect(() => {
        document.title = 'My Applications | SkillAnchor';
    }, []);

    const {
        data,
        isLoading: loading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useApplications();

    const applications = useMemo(() => {
        return data?.pages?.flatMap((page: PaginatedApplicationsResponse) => page.applications) || [];
    }, [data]);
    const withdrawMutation = useWithdrawApplication();

    const handleWithdraw = async (appId: string) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) {
            return;
        }
        try {
            await withdrawMutation.mutateAsync(appId);
        } catch {
            alert("Failed to withdraw application");
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col gap-6 animate-pulse">
                    <div className="h-10 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-bg-body bg-[radial-gradient(circle_at_top_right,var(--primary-50),transparent),radial-gradient(circle_at_bottom_left,var(--indigo-50),transparent)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.05),transparent)]">
            <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="mb-10">
                    <Link href="/" className="no-underline inline-flex items-center gap-2 px-4 py-2 rounded-xl text-text-muted text-sm font-semibold hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-indigo-500/10 hover:-translate-x-1 transition-all mb-6">
                        ← Back to Jobs
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                        Application Tracker
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Track and manage your career journey in one place.
                    </p>
                </div>

                <ApplicationStats applications={applications} />

                {applications.length === 0 ? (
                    <div className="text-center py-24 bg-bg-card/70 backdrop-blur-xl rounded-[40px] border border-slate-900/10 dark:border-white/10 border-dashed">
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-500">
                            <FileCheck size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No applications yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium">
                            Start your journey by applying to jobs that match your skills.
                        </p>
                        <Link href="/" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold no-underline hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
                            Browse Opportunities
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <Virtuoso
                            useWindowScroll
                            data={applications}
                            endReached={() => {
                                if (hasNextPage) fetchNextPage();
                            }}
                            itemContent={(_index: number, app: Application) => (
                                <div className="group p-6 md:p-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] ring-1 ring-slate-900/5 dark:ring-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:scale-[1.005] hover:border-primary-200 dark:hover:border-primary-900 transition-all duration-400 mb-8 overflow-hidden">
                                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                                        <div className="flex-grow w-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                                                        {app.job?.title || 'Job Deleted'}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-5 text-slate-500 dark:text-slate-400 font-semibold text-sm">
                                                        <span className="flex items-center gap-2">
                                                            <MapPin size={18} className="opacity-70" /> {app.job?.city}, {app.job?.state}
                                                        </span>
                                                        <span className="flex items-center gap-2 text-indigo-500">
                                                            <Calendar size={18} /> Applied {formatDate(app.appliedAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="hidden md:flex gap-3">
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-bg-surface text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 hover:rotate-6 hover:scale-110 transition-all border-none cursor-pointer shadow-sm"
                                                        title="View Details"
                                                    >
                                                        <Eye size={22} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleWithdraw(app._id)}
                                                        disabled={withdrawMutation.isPending || !['pending', 'reviewed'].includes(app.status)}
                                                        className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all border-none shadow-sm ${
                                                            ['pending', 'reviewed'].includes(app.status) 
                                                            ? 'bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 hover:-rotate-6 hover:scale-110 cursor-pointer' 
                                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-300 cursor-not-allowed'
                                                        }`}
                                                        title="Withdraw Application"
                                                    >
                                                        <XCircle size={22} />
                                                    </button>
                                                </div>
                                            </div>

                                            <ApplicationPipeline status={app.status} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex md:hidden gap-3 mt-8">
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="flex-grow py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm border-none cursor-pointer active:scale-95 transition-transform"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleWithdraw(app._id)}
                                            disabled={withdrawMutation.isPending || !['pending', 'reviewed'].includes(app.status)}
                                            className={`px-6 py-3 rounded-2xl font-bold text-sm border-none active:scale-95 transition-transform ${
                                                ['pending', 'reviewed'].includes(app.status) 
                                                ? 'bg-red-50 text-red-500' 
                                                : 'bg-slate-50 text-slate-300'
                                            }`}
                                        >
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            )}
                            components={{
                                Footer: () => (
                                    <div className="pb-20">
                                        {isFetchingNextPage && (
                                            <div className="text-center py-10 flex justify-center">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-400 opacity-50" />
                                            </div>
                                        )}
                                    </div>
                                )
                            }}
                        />
                    </div>
                )}
                {selectedApp && (
                    <Suspense fallback={null}>
                        <ApplicationDetailModal
                            selectedApp={selectedApp}
                            onClose={() => setSelectedApp(null)}
                            getStatusBadge={() => null} // No longer used in modernized UI
                        />
                    </Suspense>
                )}
            </div>
        </div>
    );
}
