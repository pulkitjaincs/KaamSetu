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
import { Briefcase, X, MapPin, Banknote, Award, Users, Check, CheckCheck, ExternalLink, Building2, Clock } from "lucide-react";
import type { Job, Application } from '@/types';

const ApplyModal = dynamic(() => import("@/components/common/ApplyModal"), { ssr: false });

interface ListingProps {
    job: Job | null;
    onClose: () => void;
    isSwitch?: boolean;
}

const Listing = memo(({ job, onClose, isSwitch = false }: ListingProps) => {
    const [imageError, setImageError] = useState(false);
    const router = useRouter();
    const { user } = useAuth();
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile && job && !isClosing) {
            document.body.classList.add('lock-scroll');
        } else {
            document.body.classList.remove('lock-scroll');
        }
        return () => {
            document.body.classList.remove('lock-scroll');
        };
    }, [isMobile, job, isClosing]);

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
        setTimeout(() => onClose(), isMobile ? 250 : 150);
    }, [onClose, isMobile]);

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
        hidden: isMobile
            ? { y: "100%", x: 0, opacity: 1 }
            : { opacity: 0, x: 20 },
        enter: {
            opacity: 1, x: 0, y: 0,
            transition: isMobile ? {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
            } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
        },
        switch: {
            opacity: 1, x: 0, y: 0,
            transition: { duration: 0.25, ease: "easeOut" }
        },
        exit: isMobile
            ? { y: "100%", transition: { duration: 0.25, ease: "easeIn" } }
            : { opacity: 0, x: 20, transition: { duration: 0.2, ease: "easeIn" } }
    };

    // ── Empty state ──────────────────────────────────────────────────────────────
    if (!job) {
        return (
            <div className="h-full flex flex-col items-center justify-center px-4 gap-6">
                <div className="w-20 h-20 rounded-[24px] flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <Briefcase className="text-2xl text-[var(--text-muted)]" />
                </div>
                <div className="text-center">
                    <h5 className="font-bold mb-1 text-[var(--text-main)] tracking-tight">Select a job</h5>
                    <p className="text-sm text-[var(--text-muted)]">Click any listing to preview it here</p>
                </div>
            </div>
        );
    }

    const canApply = user?.role !== 'employer';

    // ── Main panel ───────────────────────────────────────────────────────────────
    return (
        <AnimatePresence mode="wait">
            {!isClosing && (
                <>
                    {/* Backdrop for mobile */}
                    {isMobile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="sheet-backdrop pointer-events-auto"
                            style={{ touchAction: 'none' }}
                        />
                    )}

                    <motion.div
                        layout="position"
                        key={job._id}
                        initial="hidden"
                        animate={isSwitch ? "switch" : "enter"}
                        exit="exit"
                        variants={variants}
                        className={`detail-panel flex flex-col z-[2001] bg-[var(--bg-card)] pointer-events-auto ${isMobile ? 'rounded-t-[32px] !rounded-b-none h-[75vh] w-full border-b-0 mb-0' : 'h-full'}`}
                        style={{
                            willChange: 'transform, opacity',
                            transform: 'translateZ(0)',
                            overscrollBehavior: 'contain',
                            boxShadow: isMobile ? '0 -10px 40px rgba(0,0,0,0.1)' : undefined
                        }}
                    >
                        {isMobile && <div className="sheet-handle shrink-0" />}
                        {/* ── HERO HEADER ──────────────────────────────────────────────── */}
                        {!isMobile ? (
                            <div className="px-8 pt-8 pb-4 flex items-start justify-between border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                                <div className="flex items-center gap-5">
                                    {!imageError && (
                                        <div className="w-20 h-20 rounded-[22px] overflow-hidden border border-[var(--border-color)] relative shrink-0 shadow-sm bg-[var(--bg-surface)]">
                                            {job.company?.logo ? (
                                                <Image
                                                    src={job.company.logo}
                                                    alt={job.company.name}
                                                    fill
                                                    sizes="80px"
                                                    className="object-contain p-2"
                                                    unoptimized
                                                    onError={() => setImageError(true)}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-white text-3xl bg-gradient-to-br from-[var(--primary-main)] to-[var(--primary-700)]">
                                                    {job.title?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-3">
                                            <h2 className="font-black text-[var(--text-main)] text-2xl leading-none tracking-tight">{job.company?.name}</h2>
                                            <span className="text-[0.7rem] uppercase font-black tracking-[0.1em] text-[var(--primary-main)] px-3 py-1 bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 border border-[var(--primary-100)] dark:border-[var(--primary-800)] rounded-lg">{(job.jobType || 'Full-time').replace(/-/g, ' ')}</span>
                                        </div>
                                        <h1 className="text-[var(--text-muted)] text-lg font-medium">{job.title}</h1>
                                    </div>
                                </div>

                                <button
                                    onClick={handleClose}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] transition-all hover:bg-[var(--border-color)]/20 hover:scale-110 active:scale-95 shadow-sm"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="px-6 pt-2 pb-3 flex items-center">
                                <div className="flex items-center gap-4">
                                    {!imageError && (
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[var(--border-color)] relative shrink-0 shadow-sm bg-[var(--bg-surface)]">
                                            {job.company?.logo ? (
                                                <Image
                                                    src={job.company.logo}
                                                    alt={job.company.name}
                                                    fill
                                                    sizes="56px"
                                                    className="object-cover p-1.5"
                                                    unoptimized
                                                    onError={() => setImageError(true)}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-white text-xl bg-gradient-to-br from-[var(--primary-main)] to-[var(--primary-600)]">
                                                    {job.title?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-0.5">
                                        <h6 className="font-bold text-[var(--text-main)] text-lg leading-tight tracking-tight">{job.company?.name}</h6>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[0.65rem] uppercase font-extrabold tracking-[0.05em] text-[var(--primary-main)] px-2 py-0.5 bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 rounded-md">{(job.jobType || 'Full-time').replace(/-/g, ' ')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── SCROLLABLE BODY ───────────────────────────────────────────── */}
                        <div className="grow overflow-auto custom-scroll" style={{ minHeight: 0 }}>
                            <div className={`px-6 pb-0 ${isMobile ? 'pt-6' : 'pt-10'}`}>
                                {/* Identity block */}
                                <h4 className="font-extrabold text-2xl text-[var(--text-main)] tracking-tight leading-[1.15]">
                                    {job.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 mb-8">
                                    <div className="flex items-center text-sm text-[var(--text-muted)] font-medium">
                                        <MapPin size={14} className="mr-1.5 text-[var(--primary-main)]" />
                                        {job.city}, {job.state}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                                    <div className="flex items-center text-sm text-[var(--text-muted)] font-medium">
                                        <Clock size={14} className="mr-1.5 text-[var(--primary-main)]" />
                                        {formatDate(job.createdAt)}
                                    </div>
                                </div>

                                {/* Quick stats bar */}
                                <div className={isMobile ? "grid grid-cols-2 gap-3 mb-10" : "flex items-center gap-px rounded-2xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-surface)] shadow-sm mb-12"}>
                                    {[
                                        { Icon: Banknote, label: isMobile ? 'Annual Salary' : 'Salary Package', value: formatSalary(job.salaryMin, job.salaryMax, job.salaryType) },
                                        { Icon: Award, label: isMobile ? 'Exp. Required' : 'Required Experience', value: (job.experienceMin ?? 0) > 0 ? `${job.experienceMin}+ years` : 'Fresher' },
                                        { Icon: Users, label: isMobile ? 'Vacancies' : 'Positions Open', value: `${job.vacancies ?? 1} Vacancy` },
                                        { Icon: Building2, label: 'Work Mode', value: job.workMode || 'On-site' },
                                    ].map((s, i) => (
                                        <div key={i} className={isMobile ? "p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-1 shadow-sm" : "flex-1 flex flex-col items-center justify-center py-5 px-4 bg-[var(--bg-surface)] transition-all group"}>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <s.Icon className="text-[var(--primary-main)] opacity-70 group-hover:scale-110 transition-transform" size={16} />
                                                <div className="text-[0.6rem] font-black uppercase tracking-wider text-[var(--text-muted)]">
                                                    {s.label}
                                                </div>
                                            </div>
                                            <div className="text-[0.95rem] font-bold text-[var(--text-main)]">
                                                {s.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Description */}
                                <div className="mb-12">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-main)]" />
                                        <span className="font-bold uppercase text-[0.7rem] tracking-[0.15em] text-[var(--text-main)] opacity-60">About the Role</span>
                                        <div className="grow h-px bg-[var(--border-color)] opacity-50"></div>
                                    </div>
                                    <p className="text-[var(--text-main)] text-[0.95rem] leading-relaxed opacity-85 whitespace-pre-line font-medium">
                                        {job.description}
                                    </p>
                                </div>

                                {/* Skills */}
                                {job.skills && job.skills.length > 0 && (
                                    <div className="mb-12">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-main)]" />
                                            <span className="font-bold uppercase text-[0.7rem] tracking-[0.15em] text-[var(--text-main)] opacity-60">Key Skills</span>
                                            <div className="grow h-px bg-[var(--border-color)] opacity-50"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {job.skills.map((skill, index) => (
                                                <span key={index} className="text-[0.8rem] font-bold rounded-xl px-4 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Benefits */}
                                {job.benefits && job.benefits.length > 0 && (
                                    <div className="mb-12">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-main)]" />
                                            <span className="font-bold uppercase text-[0.7rem] tracking-[0.15em] text-[var(--text-main)] opacity-60">Company Perks</span>
                                            <div className="grow h-px bg-[var(--border-color)] opacity-50"></div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {job.benefits.map((b: string, idx: number) => (
                                                <div key={idx} className="flex items-start gap-4 p-3 rounded-2xl bg-[var(--bg-surface)]/50 border border-[var(--border-color)] shadow-sm">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-[var(--primary-main)]/10">
                                                        <Check size={14} className="text-[var(--primary-main)]" />
                                                    </div>
                                                    <span className="text-[var(--text-main)] text-[0.9rem] font-medium leading-snug">{b}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`shrink-0 px-4 py-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] ${isMobile ? 'pb-[calc(1rem+env(safe-area-inset-bottom))] !rounded-b-none !border-b-0' : ''}`}>
                            <div className="grid gap-2">
                                {canApply && (
                                    <button
                                        onClick={() => user
                                            ? setShowApplyModal(true)
                                            : router.push(`/login?redirect=/?openJob=${job._id}`)
                                        }
                                        disabled={applied}
                                        className={`py-3.5 font-bold rounded-2xl transition-all ${applied ? 'bg-[var(--zinc-400)] opacity-60 cursor-not-allowed' : 'auth-submit-btn hover:opacity-90 active:scale-[0.98]'}`}
                                    >
                                        {applied
                                            ? <span className="flex items-center justify-center gap-2"><CheckCheck size={20} />Already Applied</span>
                                            : <span>Apply Now &nbsp;→</span>
                                        }
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push(`/jobs/${job._id}`)}
                                    className="py-2.5 font-semibold rounded-xl flex items-center justify-center gap-2 bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] text-sm transition-colors hover:bg-[var(--border-color)]/20"
                                >
                                    <ExternalLink size={16} />
                                    View full details
                                </button>
                            </div>
                        </div>

                        {/* Apply modal */}
                        <Suspense fallback={null}>
                            <ApplyModal
                                show={showApplyModal}
                                onClose={() => setShowApplyModal(false)}
                                onApply={handleApply}
                                applying={applying}
                            />
                        </Suspense>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

Listing.displayName = 'Listing';

export default Listing;
