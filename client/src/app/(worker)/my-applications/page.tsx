"use client";

import { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import Link from 'next/link';
import { formatDate, formatSalary } from '@/utils/index';
import { Application, PaginatedApplicationsResponse } from '@/types';
import { Eye, XCircle, FileCheck } from 'lucide-react';

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
            <div className="container py-8 md:py-12">
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
        <div className="container py-8 md:py-12">
            <div className="mb-10">
                <Link href="/" className="text-slate-500 hover:text-indigo-600 no-underline inline-flex items-center gap-2 mb-6 transition-colors font-medium">
                    ← Back to Jobs
                </Link>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    Application Tracker
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Track and manage your career journey in one place.
                </p>
            </div>

            <ApplicationStats applications={applications} />

            {applications.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-none ring-1 ring-slate-900/10 dark:ring-white/10 border-dashed">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-500">
                        <FileCheck size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No applications yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                        Start your journey by applying to jobs that match your skills.
                    </p>
                    <Link href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold no-underline hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
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
                            <div className="p-5 md:p-6 bg-white dark:bg-slate-900 rounded-[32px] ring-1 ring-slate-900/5 dark:ring-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all mb-6 overflow-hidden">
                                <div className="flex flex-col lg:flex-row gap-6 items-start">
                                    <div className="flex-grow w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                                    {app.job?.title || 'Job Deleted'}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <i className="bi bi-geo-alt"></i> {app.job?.city}, {app.job?.state}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-indigo-500">
                                                        <i className="bi bi-calendar3"></i> Applied {formatDate(app.appliedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="hidden md:flex gap-2">
                                                <button
                                                    onClick={() => setSelectedApp(app)}
                                                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-all border-none cursor-pointer"
                                                    title="View Details"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleWithdraw(app._id)}
                                                    disabled={withdrawMutation.isPending || !['pending', 'reviewed'].includes(app.status)}
                                                    className={`p-2.5 rounded-xl transition-all border-none ${
                                                        ['pending', 'reviewed'].includes(app.status) 
                                                        ? 'bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 cursor-pointer' 
                                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-300 cursor-not-allowed'
                                                    }`}
                                                    title="Withdraw Application"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <ApplicationPipeline status={app.status} />
                                    </div>
                                </div>
                                
                                <div className="flex md:hidden gap-3 mt-6">
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="flex-grow py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm border-none cursor-pointer"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleWithdraw(app._id)}
                                        disabled={withdrawMutation.isPending || !['pending', 'reviewed'].includes(app.status)}
                                        className={`px-4 py-2 rounded-xl font-bold text-sm border-none ${
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
                                        <div className="text-center py-6">
                                            <div className="spinner-border spinner-border-sm text-slate-300"></div>
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
    );
}
