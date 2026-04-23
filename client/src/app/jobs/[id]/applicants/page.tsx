"use client";

import Image from 'next/image';
import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useJobDetails, useJobApplicants, useUpdateApplicationStatus } from '@/hooks/queries/useApplications';
import { Application, PaginatedApplicationsResponse } from '@/types';
import { Users, Inbox, Phone, Mail, Calendar, Clock, Eye, Star, XCircle, Trophy, Slash, Loader2, type LucideIcon } from 'lucide-react';

export default function JobApplicantsPage() {
    const params = useParams();
    const jobId = params.id as string;

    const { data: job, isLoading: jobLoading } = useJobDetails(jobId);

    const {
        data: applicantsData,
        isLoading: applicantsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useJobApplicants(jobId);

    const applications = useMemo(() => {
        return applicantsData?.pages?.flatMap((page: PaginatedApplicationsResponse) => page.applications) || [];
    }, [applicantsData]);
    const updateStatusMutation = useUpdateApplicationStatus();

    const loading = jobLoading || applicantsLoading;

    const handleStatusChange = async (appId: string, newStatus: string) => {
        if (newStatus === 'hired') {
            const confirmHiring = window.confirm("Are you sure you want to hire this worker? This action is permanent and will add them to your team.");
            if (!confirmHiring) return;
        }
        try {
            await updateStatusMutation.mutateAsync({ appId, status: newStatus });
        } catch {
            alert("Failed to update status");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string, text: string, icon: LucideIcon }> = {
            pending: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-500', icon: Clock },
            reviewed: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-500', icon: Eye },
            shortlisted: { bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-500', icon: Star },
            rejected: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-500', icon: XCircle },
            hired: { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-500', icon: Trophy },
            "employment-ended": { bg: 'bg-slate-100 dark:bg-slate-500/10', text: 'text-slate-500', icon: Slash }
        };
        const s = styles[status] || styles.pending;
        const Icon = s.icon;
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                <Icon size={14} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-8">
                <Link href="/my-jobs" className="text-slate-500 hover:text-indigo-600 no-underline inline-flex items-center gap-2 mb-6 transition-colors font-medium">
                    ← Back to My Jobs
                </Link>
                <h2 className="flex items-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    <Users className="w-8 h-8 mr-3 text-indigo-500" />
                    Applicants
                </h2>
                {job && (
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        For: <strong className="text-slate-900 dark:text-white">{job.title}</strong> — {job.city}, {job.state}
                    </p>
                )}
            </div>
            {applications.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-none ring-1 ring-slate-900/10 dark:ring-white/10 border-dashed">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-500">
                        <Inbox size={40} />
                    </div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">No applications yet for this job.</p>
                </div>
            ) : (
                <div className="flex flex-col">
                    <Virtuoso
                        useWindowScroll
                        data={applications}
                        endReached={() => {
                            if (hasNextPage) fetchNextPage();
                        }}
                        itemContent={(index, app: Application) => (
                            <div className="p-5 md:p-6 bg-white dark:bg-slate-900 rounded-[24px] ring-1 ring-slate-900/5 dark:ring-white/5 shadow-sm hover:shadow-md transition-shadow mb-4">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                                    <div className="lg:col-span-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center rounded-full overflow-hidden w-12 h-12 bg-indigo-500 text-white font-bold text-lg shrink-0">
                                                {app.applicant?.avatarUrl ? (
                                                    <Image src={app.applicant.avatarUrl} alt={app.applicant?.name ?? 'Applicant'} width={48} height={48} className="w-full h-full object-cover" />
                                                ) : (
                                                    app.applicant?.name?.charAt(0).toUpperCase() || '?'
                                                )}
                                            </div>
                                            <div>
                                                <Link href={`/profile/${app.applicant?._id}?fromJob=${jobId}`} className="no-underline">
                                                    <h5 className="font-bold text-lg text-slate-900 dark:text-white mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                        {app.applicant?.name || 'Unknown'}
                                                    </h5>
                                                </Link>
                                                <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                                    {app.applicant?.phone && (
                                                        <span className="flex items-center gap-1.5"><Phone size={14} /> {app.applicant.phone}</span>
                                                    )}
                                                    {app.applicant?.email && (
                                                        <span className="flex items-center gap-1.5"><Mail size={14} /> {app.applicant.email}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4">
                                        <div className="flex items-center gap-4">
                                            {getStatusBadge(app.status)}
                                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                                <Calendar size={14} />
                                                {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB') : '—'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-3 lg:text-right">
                                        <div className="flex justify-start lg:justify-end">
                                            <select
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                disabled={(updateStatusMutation.isPending && (updateStatusMutation.variables as { appId: string })?.appId === app._id) ||
                                                    app.status === 'hired' ||
                                                    app.status === 'employment-ended'}
                                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="shortlisted">Shortlisted</option>
                                                <option value="hired">Hired</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {app.coverNote && (
                                    <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <small className="font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Cover Note</small>
                                        <p className="mb-0 mt-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                            {app.coverNote}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        components={{
                            Footer: () => isFetchingNextPage ? (
                                <div className="text-center py-6 flex justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                </div>
                            ) : null
                        }}
                    />
                </div>
            )}
        </div>
    );
}
