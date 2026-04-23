"use client";

import { useState, useEffect, useCallback, Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { useAuth } from '@/context/AuthContext';
import { applicationsAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { formatDate, formatSalary } from "@/utils/index";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Briefcase, X, MapPin, Banknote, Award, Users, Check, CheckCheck, ExternalLink } from "lucide-react";
import type { Job, Application } from '@/types';

const ApplyModal = dynamic(() => import("@/components/common/ApplyModal"), { ssr: false });

interface ListingProps {
    job: Job | null;
    onClose: () => void;
    isSwitch?: boolean;
}

const Listing = memo(({ job, onClose, isSwitch = false }: ListingProps) => {
    const router = useRouter();
    const { user } = useAuth();
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const checkIfApplied = async () => {
            if (!user || user.role !== 'worker' || !job) {
                setApplied(false);
                return;
            }
            try {
                const res = await applicationsAPI.getMyApplications();
                const apps = res.data?.applications || [];
                const hasApplied = apps.some((app: Application) => app.job._id === job._id);
                setApplied(hasApplied);
            } catch { /* silently ignore */ }
        };
        checkIfApplied();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job?._id, user]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => onClose(), 150);
    }, [onClose]);

    const handleApply = async (coverNote: string) => {
        if (!job) return;
        if (!user) {
            router.push(`/login?redirect=/?openJob=${job._id}`);
            return;
        }
        setApplying(true);
        try {
            await applicationsAPI.apply(job._id, { coverNote });
            setApplied(true);
            setShowApplyModal(false);
        } catch (error: unknown) {
            const axiosErr = error as { response?: { data?: { message?: string } } };
            alert(axiosErr.response?.data?.message || "Error applying for job");
        } finally {
            setApplying(false);
        }
    };

    const variants: Variants = {
        hidden: { opacity: 0, x: 24, scale: 0.98 },
        enter: {
            opacity: 1, x: 0, scale: 1,
            transition: { type: "spring", stiffness: 350, damping: 28, mass: 0.8 }
        },
        switch: {
            opacity: 1, scale: 1, x: 0,
            transition: { duration: 0.18, ease: "easeOut" }
        },
        exit: {
            opacity: 0, x: 16, scale: 0.98,
            transition: { duration: 0.15, ease: "easeIn" }
        }
    };

    // ── Empty state ──────────────────────────────────────────────────────────────
    if (!job) {
        return (
            <div className="h-full flex flex-col items-center justify-center px-4" style={{ gap: '1.5rem' }}>
                <div className="rounded-3xl flex items-center justify-center"
                    style={{ width: 80, height: 80, background: 'var(--bg-card)', border: '1.5px solid var(--border-color)' }}>
                    <Briefcase className="text-2xl" style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="text-center">
                    <h5 className="font-black mb-1" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Select a job</h5>
                    <p className="text-sm mb-0" style={{ color: 'var(--text-muted)' }}>Click any listing to preview it here</p>
                </div>
            </div>
        );
    }

    const canApply = user?.role !== 'employer';

    // ── Main panel ───────────────────────────────────────────────────────────────
    return (
        <AnimatePresence mode="wait">
            {!isClosing && (
                <motion.div
                    key={job._id}
                    initial="hidden"
                    animate={isSwitch ? "switch" : "enter"}
                    exit="exit"
                    variants={variants}
                    className="h-full flex flex-col overflow-hidden"
                    style={{
                        borderRadius: '20px',
                        background: 'var(--bg-card)',
                        boxShadow: '0 24px 64px -12px rgba(0,0,0,0.18)',
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                    }}
                >
                    {/* ── HERO HEADER ──────────────────────────────────────────────── */}
                    <div className="relative shrink-0 overflow-hidden" style={{
                        height: '160px',
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4f46e5 75%, #7c3aed 100%)',
                        borderRadius: '20px 20px 0 0',
                    }}>
                        {/* Radial glow overlay */}
                        <div className="absolute w-full h-full" style={{
                            inset: 0,
                            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(139,92,246,0.5) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(99,102,241,0.35) 0%, transparent 45%)',
                        }}></div>

                        {/* Close button — top right */}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 rounded-full p-0 flex items-center justify-center"
                            style={{
                                width: 36, height: 36,
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: 'white',
                                zIndex: 10,
                                transition: 'background 0.2s ease',
                            }}
                            aria-label="Close"
                        >
                            <X style={{ width: '1.2rem', height: '1.2rem' }} />
                        </button>

                        {/* Job type badge */}
                        <div className="absolute bottom-3 right-3 z-[2]">
                            <span className="rounded-full font-bold uppercase"
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontSize: '0.62rem',
                                    letterSpacing: '0.08em',
                                    padding: '5px 11px',
                                }}>
                                {(job.jobType || 'Full-time').replace(/-/g, ' ')}
                            </span>
                        </div>

                        {/* Floating logo — bottom left, bleeds out */}
                        <div className="absolute" style={{ bottom: '-36px', left: '24px', zIndex: 5 }}>
                            <div className="rounded-3xl overflow-hidden shadow-lg border-[3px]"
                                style={{
                                    width: 72, height: 72,
                                    borderColor: 'var(--bg-body)',
                                    background: 'var(--bg-card)',
                                    position: 'relative',
                                }}>
                                {job.company?.logo ? (
                                    <Image src={job.company.logo} alt={job.company.name} fill sizes="72px" style={{ objectFit: 'cover' }} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-black text-white"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '1.6rem' }}>
                                        {job.title?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── SCROLLABLE BODY ───────────────────────────────────────────── */}
                    <div className="grow overflow-auto custom-scroll" style={{ minHeight: 0 }}>
                        {/* Identity block */}
                        <div className="px-4 pt-5 pb-0 mt-3">
                            <h4 className="font-black mb-1" style={{
                                color: 'var(--text-main)',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.15,
                                fontSize: '1.3rem',
                            }}>
                                {job.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
                                <span className="font-bold text-sm" style={{ color: 'var(--primary-500)' }}>{job.company?.name}</span>
                                <span style={{ color: 'var(--border-color)' }}>·</span>
                                <span className="text-sm flex items-center" style={{ color: 'var(--text-muted)' }}>
                                    <MapPin className="mr-1" style={{ width: '1rem', height: '1rem' }} />{job.city}, {job.state}
                                </span>
                                <span style={{ color: 'var(--border-color)' }}>·</span>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    {formatDate(job.createdAt)}
                                </span>
                            </div>

                            {/* Quick stats bar */}
                            <div className="flex rounded-xl overflow-hidden mb-10" style={{ border: '1px solid var(--border-color)' }}>
                                {[
                                    { Icon: Banknote, label: 'Salary', value: formatSalary(job.salaryMin, job.salaryMax, job.salaryType) },
                                    { Icon: Award, label: 'Exp', value: (job.experienceMin ?? 0) > 0 ? `${job.experienceMin}+ yr` : 'Fresher' },
                                    { Icon: Users, label: 'Open', value: `${job.vacancies ?? 1}` },
                                ].map((s, i, arr) => (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-center py-3 px-2"
                                        style={{
                                            background: 'var(--bg-surface)',
                                            borderRight: i < arr.length - 1 ? '1px solid var(--border-color)' : 'none',
                                        }}>
                                        <s.Icon className="mb-1" style={{ color: 'var(--primary-500)', width: '1.2rem', height: '1.2rem' }} />
                                        <div className="uppercase font-black opacity-40 mb-1" style={{ fontSize: '0.52rem', letterSpacing: '1px' }}>{s.label}</div>
                                        <div className="font-bold truncate text-center" style={{ color: 'var(--text-main)', fontSize: '0.78rem' }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="font-black uppercase opacity-40" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>About the Role</span>
                                    <div className="grow" style={{ height: 1, background: 'var(--border-color)' }}></div>
                                </div>
                                <p style={{ color: 'var(--text-main)', opacity: 0.82, lineHeight: '1.75', fontSize: '0.92rem', whiteSpace: 'pre-line' }}>
                                    {job.description}
                                </p>
                            </div>

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="mb-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="font-black uppercase opacity-40" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Skills</span>
                                        <div className="grow" style={{ height: 1, background: 'var(--border-color)' }}></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span key={index}
                                                className="font-semibold rounded-full px-3 py-1"
                                                style={{
                                                    background: 'var(--bg-surface)',
                                                    color: 'var(--text-main)',
                                                    border: '1.5px solid var(--border-color)',
                                                    fontSize: '0.78rem',
                                                }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            {job.benefits && job.benefits.length > 0 && (
                                <div className="mb-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="font-black uppercase opacity-40" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Perks</span>
                                        <div className="grow" style={{ height: 1, background: 'var(--border-color)' }}></div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {job.benefits.map((b: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="rounded-full flex items-center justify-center shrink-0"
                                                    style={{ width: 20, height: 20, background: 'rgba(16,185,129,0.12)' }}>
                                                    <Check style={{ color: '#10b981', width: '0.8rem', height: '0.8rem' }} />
                                                </div>
                                                <span style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── STICKY ACTION FOOTER ──────────────────────────────────────── */}
                    <div className="shrink-0 px-4 py-4" style={{
                        borderTop: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                    }}>
                        <div className="grid gap-2">
                            {canApply && (
                                <button
                                    onClick={() => user
                                        ? setShowApplyModal(true)
                                        : router.push(`/login?redirect=/?openJob=${job._id}`)
                                    }
                                    disabled={applied}
                                    className="py-3 font-black rounded-full"
                                    style={{
                                        fontSize: '0.95rem',
                                        letterSpacing: '-0.01em',
                                        background: applied ? 'var(--zinc-400)' : 'var(--zinc-900)',
                                        color: '#fff',
                                        border: 'none',
                                        opacity: applied ? 0.65 : 1,
                                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                                    }}>
                                    {applied
                                        ? <span className="flex items-center justify-center"><CheckCheck className="mr-2" style={{ width: '1.2rem', height: '1.2rem' }} />Already Applied</span>
                                        : <span>Apply Now &nbsp;→</span>
                                    }
                                </button>
                            )}
                            <button
                                onClick={() => router.push(`/jobs/${job._id}`)}
                                className="py-2 font-semibold rounded-full flex items-center justify-center gap-2"
                                style={{
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-muted)',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '0.87rem',
                                }}>
                                <ExternalLink style={{ width: '1rem', height: '1rem' }} />
                                View full details
                            </button>
                        </div>
                    </div>

                    {/* Apply modal */}
                    {showApplyModal && (
                        <Suspense fallback={null}>
                            <ApplyModal
                                show={showApplyModal}
                                onClose={() => setShowApplyModal(false)}
                                onApply={handleApply}
                                applying={applying}
                            />
                        </Suspense>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
});

Listing.displayName = 'Listing';

export default Listing;
