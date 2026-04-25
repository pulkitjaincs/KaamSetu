"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import {
    ArrowLeft, MapPin, Search, Banknote, Briefcase, Building2,
    Gift, Check, ShieldCheck, Lock, CheckCircle2,
    Link as LinkIcon, Info, Users, Send
} from 'lucide-react';
import { useJobDetails, useApplications, useApplyForJob } from '@/hooks/queries/useApplications';
import { formatSalary } from '@/utils/index';
import { PaginatedApplicationsResponse, Application } from '@/types';

const ApplyModal = dynamic(() => import('@/components/common/ApplyModal'), { ssr: false });

/* ─── Inline styles matching Stitch design tokens ─────────────────────── */
const styles = {
    glassPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 4px 24px -1px rgba(0,0,0,0.02)',
    } as React.CSSProperties,
    glassPanelDark: {
        backgroundColor: 'rgba(28, 27, 27, 0.85)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 4px 24px -1px rgba(0,0,0,0.15)',
    } as React.CSSProperties,
};

export default function JobDetailClient({ id }: { id: string }) {
    const router = useRouter();
    const { user } = useAuth();
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [imageError, setImageError] = useState(false);

    const { data: job, isLoading: loading, isError } = useJobDetails(id);
    const { data: applications } = useApplications(!!user && user.role === 'worker');
    const applyMutation = useApplyForJob();

    const applied = useMemo(() => {
        if (!user || user.role !== 'worker' || !applications) return false;
        const allApps = applications.pages?.flatMap((p: PaginatedApplicationsResponse) => p.applications) || [];
        return allApps.some((app: Application) => app.job?._id === id);
    }, [applications, user, id]);

    const handleApply = async (coverNote: string) => {
        if (!user) {
            router.push(`/login?redirect=/jobs/${id}`);
            return;
        }
        try {
            await applyMutation.mutateAsync({ jobId: id, data: { coverNote } });
            setShowApplyModal(false);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string; message?: string } } };
            alert(axiosErr.response?.data?.error || axiosErr.response?.data?.message || 'Error applying for job');
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isActive = job?.status === 'active';
    const canApply = user?.role !== 'employer';

    // ─── Loading ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="page-container py-8">
                <div className="mb-8 pt-4">
                    <div className="w-40 h-10 rounded-full animate-pulse" style={{ backgroundColor: 'var(--surface-container-high)' }} />
                </div>
                <div className="rounded-[2rem] p-8 md:p-12 mb-10 animate-pulse" style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border-color)' }}>
                    <div className="flex gap-8 items-center">
                        <div className="w-32 h-32 rounded-3xl" style={{ backgroundColor: 'var(--surface-container-high)' }} />
                        <div className="flex-grow space-y-4">
                            <div className="h-4 w-48 rounded-full" style={{ backgroundColor: 'var(--surface-container-high)' }} />
                            <div className="h-10 w-96 rounded-2xl" style={{ backgroundColor: 'var(--surface-container-high)' }} />
                            <div className="h-8 w-64 rounded-full" style={{ backgroundColor: 'var(--surface-container-high)' }} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-12 pt-12" style={{ borderTop: '1px solid var(--border-color)' }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-20 rounded-full" style={{ backgroundColor: 'var(--surface-container-high)' }} />
                                <div className="h-8 w-32 rounded-xl" style={{ backgroundColor: 'var(--surface-container-high)' }} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-[2rem] h-64 animate-pulse" style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border-color)' }} />
                    </div>
                    <div className="space-y-8">
                        <div className="rounded-[2rem] h-48 animate-pulse" style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border-color)' }} />
                    </div>
                </div>
            </div>
        );
    }

    // ─── Error ────────────────────────────────────────────────────────────
    if (isError || !job) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="text-center px-8 py-14 rounded-[2rem] max-w-md" style={{ ...styles.glassPanel }}>
                    <div className="mb-6 mx-auto rounded-full flex items-center justify-center w-24 h-24" style={{ backgroundColor: 'var(--surface-container-high)' }}>
                        <Search className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <h3 className="font-[var(--font-plus-jakarta)] text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>Job Not Found</h3>
                    <p className="mb-8 font-medium" style={{ color: 'var(--text-muted)' }}>It may have been removed or the link is broken.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full font-bold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: 'var(--primary-main)' }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    const experienceLabel = (job.experienceMin ?? 0) > 0
        ? `${job.experienceMin}${job.experienceMax ? `-${job.experienceMax}` : '+'} Years`
        : 'Fresher';

    const workModeLabel = job.workMode
        ? job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)
        : job.shift
            ? job.shift.charAt(0).toUpperCase() + job.shift.slice(1)
            : 'On-site';

    // ─── Main render ──────────────────────────────────────────────────────
    return (
        <div className="pb-28 font-[family-name:var(--font-inter)] antialiased" style={{ color: 'var(--text-main)' }}>

            <main className="page-container">
                {/* ═══ Back Action ════════════════════════════════════════════ */}
                <div className="mb-8 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-3 font-medium transition-colors group"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <span
                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all group-hover:shadow-md"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </span>
                        <span className="text-[15px]">Back to Search Results</span>
                    </button>
                </div>

                {/* ═══ Editorial Hero ═════════════════════════════════════════ */}
                <div
                    className="rounded-[2rem] p-8 md:p-12 mb-10"
                    style={styles.glassPanel}
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        {/* Company Logo */}
                        <div
                            className="w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                        >
                            {job.company?.logo && !imageError ? (
                                <Image
                                    src={job.company.logo}
                                    alt={job.company.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover p-2"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center font-extrabold text-3xl text-white"
                                    style={{ background: 'linear-gradient(135deg, var(--primary-main) 0%, var(--primary-container) 100%)' }}
                                >
                                    {job.title?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Title Block */}
                        <div className="flex-grow space-y-4">
                            <div className="flex items-center flex-wrap gap-3">
                                <span
                                    className="font-[family-name:var(--font-plus-jakarta)] font-bold text-[15px] uppercase tracking-wider"
                                    style={{ color: 'var(--primary-main)' }}
                                >
                                    {job.company?.name || 'Company'}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border-color)' }} />
                                <span className="font-medium text-[15px] flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                                    <MapPin className="w-4 h-4" />
                                    {job.city}, {job.state}{job.workMode ? ` (${workModeLabel})` : ''}
                                </span>
                            </div>

                            <h1
                                className="font-[family-name:var(--font-plus-jakarta)] text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight"
                                style={{ color: 'var(--on-surface)' }}
                            >
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                {isActive && (
                                    <div
                                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-[family-name:var(--font-plus-jakarta)] font-semibold"
                                        style={{
                                            backgroundColor: 'rgba(0, 86, 182, 0.1)',
                                            color: 'var(--primary-main)',
                                            border: '1px solid rgba(0, 86, 182, 0.2)',
                                        }}
                                    >
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--primary-main)' }} />
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: 'var(--primary-main)' }} />
                                        </span>
                                        Actively Recruiting
                                    </div>
                                )}
                                {!isActive && (
                                    <div
                                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-[family-name:var(--font-plus-jakarta)] font-semibold"
                                        style={{
                                            backgroundColor: 'rgba(234, 179, 8, 0.1)',
                                            color: '#b45309',
                                            border: '1px solid rgba(234, 179, 8, 0.2)',
                                        }}
                                    >
                                        {job.status?.charAt(0).toUpperCase()}{job.status?.slice(1)}
                                    </div>
                                )}
                                <div
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[14px] font-[family-name:var(--font-plus-jakarta)] font-semibold"
                                    style={{
                                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                        color: '#047857',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                    }}
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    SkillAnchor Verified
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Information Grid ──────────────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-12" style={{ borderTop: '1px solid var(--border-color)' }}>
                        {[
                            { icon: Banknote, label: 'Package', value: formatSalary(job.salaryMin, job.salaryMax, job.salaryType) },
                            { icon: Briefcase, label: 'Experience', value: experienceLabel },
                            { icon: Users, label: 'Vacancies', value: `${job.vacancies || 1} Opening${(job.vacancies || 1) > 1 ? 's' : ''}` },
                            { icon: Building2, label: 'Work Mode', value: workModeLabel },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
                                    <stat.icon className="w-5 h-5" />
                                    <span className="text-[13px] font-medium uppercase tracking-wider">{stat.label}</span>
                                </div>
                                <div
                                    className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold"
                                    style={{ color: 'var(--on-surface)' }}
                                >
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══ Main Content Split ═════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Left Column: Editorial Content ─────────────────────── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About the Role */}
                        {job.description && (
                            <section className="rounded-[2rem] p-8 md:p-10" style={styles.glassPanel}>
                                <h2
                                    className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-3xl font-bold mb-6"
                                    style={{ color: 'var(--on-surface)' }}
                                >
                                    About the Role
                                </h2>
                                <div
                                    className="text-[17px] leading-relaxed space-y-6 font-medium whitespace-pre-line"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    {job.description}
                                </div>
                            </section>
                        )}

                        {/* Key Responsibilities — render if description has bullet-like lines */}
                        {job.description && job.description.includes('\n') && (
                            <section className="rounded-[2rem] p-8 md:p-10" style={styles.glassPanel}>
                                <h2
                                    className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-3xl font-bold mb-6"
                                    style={{ color: 'var(--on-surface)' }}
                                >
                                    Key Responsibilities
                                </h2>
                                <ul className="space-y-5 text-[16px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                    {job.description.split('\n').filter((line: string) => line.trim().length > 10).slice(0, 6).map((line: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div
                                                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                                style={{ backgroundColor: 'rgba(0, 86, 182, 0.1)' }}
                                            >
                                                <Check className="w-4 h-4 font-bold" style={{ color: 'var(--primary-main)' }} />
                                            </div>
                                            <span>{line.replace(/^[-•*]\s*/, '').trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* ── Right Column: Skills & Perks ───────────────────────── */}
                    <div className="space-y-8">

                        {/* Required Skills */}
                        {(job.skills?.length ?? 0) > 0 && (
                            <section className="rounded-[2rem] p-8" style={styles.glassPanel}>
                                <h3
                                    className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold mb-6"
                                    style={{ color: 'var(--on-surface)' }}
                                >
                                    Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {job.skills!.map((skill: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 rounded-full font-medium text-[14px] shadow-sm"
                                            style={{
                                                backgroundColor: 'var(--bg-card)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--on-surface)',
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Perks & Benefits */}
                        {(job.benefits?.length ?? 0) > 0 && (
                            <section className="rounded-[2rem] p-8" style={styles.glassPanel}>
                                <h3
                                    className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold mb-6"
                                    style={{ color: 'var(--on-surface)' }}
                                >
                                    Perks & Benefits
                                </h3>
                                <ul className="space-y-6">
                                    {job.benefits!.map((b: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center shrink-0"
                                                style={{
                                                    backgroundColor: 'var(--bg-card)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--primary-main)',
                                                }}
                                            >
                                                <Gift className="w-6 h-6" />
                                            </div>
                                            <div
                                                className="font-medium text-[15px] leading-tight"
                                                style={{ color: 'var(--on-surface)' }}
                                            >
                                                {b}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Employer notice */}
                        {user?.role === 'employer' && (
                            <div
                                className="flex items-start gap-3 p-5 rounded-2xl text-sm font-medium"
                                style={{
                                    backgroundColor: 'rgba(0, 86, 182, 0.06)',
                                    color: 'var(--primary-main)',
                                    border: '1px solid rgba(0, 86, 182, 0.12)',
                                }}
                            >
                                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="m-0">Switch to a worker account to apply for jobs.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ═══ Sticky Bottom Apply Bar ══════════════════════════════════ */}
            <nav
                className={`fixed left-0 w-full z-[1200] p-5 md:p-6 transition-all duration-300 ${
                    user ? 'bottom-[72px] lg:bottom-0' : 'bottom-0'
                } ${!canApply ? 'hidden md:block' : 'block'}`}
                style={{
                    backgroundColor: 'var(--header-glass-bg)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderTop: '1px solid var(--border-color)',
                    paddingBottom: !user ? 'calc(env(safe-area-inset-bottom) + 20px)' : '20px'
                }}
            >
                <div className="max-w-6xl mx-auto flex justify-center md:justify-end items-center gap-6">
                    {/* Applicant count — desktop only */}
                    <div className="hidden md:block font-medium" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-bold" style={{ color: 'var(--on-surface)' }}>
                            {job.applicationsCount ?? 0}
                        </span>{' '}
                        applicants so far
                    </div>

                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className="hidden md:flex w-10 h-10 items-center justify-center rounded-full transition-colors duration-200"
                        style={{ color: 'var(--text-muted)', backgroundColor: copied ? 'rgba(16, 185, 129, 0.1)' : 'transparent' }}
                        title={copied ? 'Link copied!' : 'Share this job'}
                    >
                        {copied ? <Check className="w-5 h-5" style={{ color: '#10b981' }} /> : <LinkIcon className="w-5 h-5" />}
                    </button>

                    {/* Apply CTA */}
                    {canApply && (
                        <button
                            onClick={() => {
                                if (!user) { router.push(`/login?redirect=/jobs/${id}`); return; }
                                setShowApplyModal(true);
                            }}
                            disabled={applied || !isActive}
                            className="w-full md:w-auto rounded-full px-10 py-4 font-[family-name:var(--font-plus-jakarta)] font-bold text-[16px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg"
                            style={{
                                backgroundColor: applied ? 'var(--surface-container-high)' : !isActive ? 'var(--surface-container-high)' : 'var(--primary-main)',
                                color: applied ? 'var(--text-muted)' : !isActive ? 'var(--text-muted)' : 'var(--on-primary)',
                                cursor: applied || !isActive ? 'not-allowed' : 'pointer',
                                boxShadow: applied || !isActive ? 'none' : '0 8px 24px -4px rgba(0, 86, 182, 0.25)',
                            }}
                        >
                            {applied ? (
                                <><CheckCircle2 className="w-5 h-5" /> Already Applied</>
                            ) : !isActive ? (
                                <><Lock className="w-5 h-5" /> Closed</>
                            ) : (
                                <>Apply Now <Send className="w-5 h-5" /></>
                            )}
                        </button>
                    )}
                </div>
            </nav>

            {/* Apply Modal */}
            <ApplyModal
                show={showApplyModal}
                onClose={() => setShowApplyModal(false)}
                onApply={handleApply}
                applying={applyMutation.isPending}
            />
        </div>
    );
}
