"use client";

import { useMemo, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Plus, Briefcase, MapPin, Calendar, CheckCircle, PauseCircle, Users, Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatSalary } from '@/utils/index';
import { useEmployerJobs, useDeleteJob } from '@/hooks/queries/useApplications';
import { PaginatedJobsResponse, Job } from '@/types';

export default function MyJobsPage() {
    const {
        data,
        isLoading: loading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useEmployerJobs();

    useEffect(() => {
        document.title = 'My Posted Jobs | SkillAnchor';
    }, []);

    const jobs = useMemo(() => {
        return data?.pages.flatMap((page: PaginatedJobsResponse) => page.jobs) || [];
    }, [data]);
    const deleteMutation = useDeleteJob();

    const handleDelete = async (jobId: string) => {
        if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteMutation.mutateAsync(jobId);
        } catch {
            alert('Failed to delete job');
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" role="status"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-bg-body bg-[radial-gradient(at_0%_0%,rgba(99,102,241,0.03)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,86,182,0.03)_0px,transparent_50%)] dark:bg-[radial-gradient(at_0%_0%,rgba(99,102,241,0.07)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,86,182,0.07)_0px,transparent_50%)]">
            <div className="w-full max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                        <Link href="/" className="no-underline inline-flex items-center text-text-muted text-sm font-semibold hover:text-primary-500 hover:-translate-x-1 transition-all">
                            <span className="mr-2">←</span> Back to Jobs
                        </Link>
                        <h2 className="font-extrabold text-text-main text-3xl md:text-4xl tracking-tight mb-0">My Posted Jobs</h2>
                    </div>
                    <Link href="/post-job" className="rounded-xl px-6 py-3 font-bold bg-zinc-900 dark:bg-zinc-50 !text-white dark:!text-zinc-900 hover:opacity-90 hover:-translate-y-0.5 shadow-lg transition-all inline-flex items-center justify-center">
                        <Plus className="mr-2" size={18} /> Post New Job
                    </Link>
                </div>

                {jobs.length === 0 ? (
                    <div className="text-center py-20 bg-bg-card rounded-[32px] border border-dashed border-border-color">
                        <Briefcase className="mb-6 block mx-auto text-text-muted opacity-50" size={56} />
                        <p className="text-lg font-semibold text-text-muted">You haven&apos;t posted any jobs yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <Virtuoso
                            useWindowScroll
                            data={jobs}
                            endReached={() => {
                                if (hasNextPage) fetchNextPage();
                            }}
                            itemContent={(_index: number, job: Job) => (
                                <div className="group p-4 lg:p-6 relative mb-4 lg:mb-5 bg-bg-card rounded-[22px] lg:rounded-[28px] border border-border-color shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.005] hover:border-primary-200 dark:hover:bg-[#232222cc] dark:hover:border-indigo-500/20 transition-all duration-500 overflow-hidden">
                                    {/* Status Stripe */}
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 lg:w-1.5 h-1/3 lg:h-1/2 rounded-r-sm transition-all duration-300 group-hover:h-[70%] ${
                                        job.status === 'active' 
                                        ? 'bg-gradient-to-b from-green-500 to-emerald-500' 
                                        : 'bg-gradient-to-b from-zinc-400 to-zinc-500'
                                    }`}></div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center pl-2 lg:pl-3">
                                        <div className="lg:col-span-6">
                                            <div className="flex items-start gap-3 lg:gap-4">
                                                {/* Desktop Icon */}
                                                <div className="hidden md:flex items-center justify-center rounded-[18px] shadow-sm border border-border-color bg-bg-surface shrink-0 w-14 h-14 text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-indigo-500/10 group-hover:border-primary-100 group-hover:-rotate-6 transition-all duration-300">
                                                    <Briefcase size={24} />
                                                </div>

                                                <div className="flex-grow min-w-0">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h5 className="font-bold truncate text-text-main text-lg lg:text-xl pr-2">
                                                            {job.title}
                                                        </h5>
                                                        {/* Mobile Status Badge */}
                                                        <div className="lg:hidden shrink-0">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                                                job.status === 'active' 
                                                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                                : 'bg-zinc-400/10 text-text-muted border-border-color'
                                                            }`}>
                                                                {job.status === 'active' ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-text-muted text-[13px] lg:text-sm font-medium">
                                                        <span className="truncate inline-flex items-center"><MapPin className="mr-1 opacity-70" size={14} />{job.city}</span>
                                                        <span className="inline-flex items-center">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                                                        <span className="inline-flex items-center"><Calendar className="mr-1 opacity-70" size={14} />{formatDate(job.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Status Badge */}
                                        <div className="hidden lg:block lg:col-span-3 text-center">
                                            <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold border transition-all duration-300 ${
                                                job.status === 'active' 
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                : 'bg-zinc-400/10 text-text-muted border-border-color'
                                            }`}>
                                                {job.status === 'active' ? <CheckCircle className="mr-1.5" size={14} /> : <PauseCircle className="mr-1.5" size={14} />}
                                                {(job.status ?? 'inactive').charAt(0).toUpperCase() + (job.status ?? 'inactive').slice(1)}
                                            </span>
                                        </div>

                                        <div className="lg:col-span-3">
                                            <div className="flex items-center justify-between lg:justify-end gap-3">
                                                <Link href={`/jobs/${job._id}/applicants`}
                                                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm border bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white transition-all no-underline">
                                                    <Users size={16} />
                                                    <span>{job.applicationsCount || 0} <span className="hidden sm:inline">Applicants</span><span className="sm:hidden">Apps</span></span>
                                                </Link>
                                                <div className="flex gap-2">
                                                    <Link href={`/jobs/${job._id}`}
                                                        className="inline-flex items-center justify-center rounded-xl shadow-sm w-9 h-9 lg:w-10 lg:h-10 bg-bg-surface text-text-main border border-border-color hover:bg-zinc-100 dark:hover:bg-white/10 hover:scale-110 transition-all no-underline"
                                                        title="View job">
                                                        <Eye size={18} />
                                                    </Link>
                                                    <Link href={`/edit-job/${job._id}`}
                                                        className="inline-flex items-center justify-center rounded-xl shadow-sm w-9 h-9 lg:w-10 lg:h-10 bg-primary-500 text-white hover:bg-primary-600 hover:shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:scale-110 transition-all no-underline"
                                                        title="Edit job">
                                                        <Pencil size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(job._id)}
                                                        disabled={deleteMutation.isPending && deleteMutation.variables === job._id}
                                                        className="inline-flex items-center justify-center rounded-xl shadow-sm w-9 h-9 lg:w-10 lg:h-10 bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 hover:shadow-[0_4px_12px_rgba(220,38,38,0.2)] hover:scale-110 transition-all disabled:opacity-50"
                                                        title="Delete job">
                                                        {deleteMutation.isPending && deleteMutation.variables === job._id ? (
                                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            components={{
                                Footer: () => isFetchingNextPage ? (
                                    <div className="text-center py-4 text-text-muted font-medium">Loading more...</div>
                                ) : null
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
