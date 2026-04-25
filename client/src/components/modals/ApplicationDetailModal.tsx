"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Application } from '@/types';
import { formatDate, formatSalary } from '@/utils/index';
import { MapPin, IndianRupee, ExternalLink, X, FileText, Calendar, Building2 } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface ApplicationDetailModalProps {
    show: boolean;
    selectedApp: Application | null;
    onClose: () => void;
    getStatusBadge: (status: string) => React.ReactNode;
}

export default function ApplicationDetailModal({ show, selectedApp, onClose, getStatusBadge }: ApplicationDetailModalProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Effect for locking scroll when show is true
    useEffect(() => {
        if (!show) return;

        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;
        
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
        };
    }, [show]);

    const variants: Variants = {
        hidden: isMobile 
            ? { y: "100%", opacity: 1 } 
            : { opacity: 0, scale: 0.95, y: 20 },
        enter: {
            opacity: 1, y: 0, scale: 1,
            transition: isMobile ? { 
                duration: 0.35,
                ease: "linear"
            } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
        },
        exit: {
            opacity: isMobile ? 1 : 0,
            y: isMobile ? "100%" : 20,
            scale: isMobile ? 1 : 0.95,
            transition: isMobile ? { 
                duration: 0.3,
                ease: "linear"
            } : { duration: 0.2, ease: "easeIn" }
        }
    };

    return (
        <AnimatePresence>
            {show && selectedApp && (
                <div className="fixed inset-0 z-[3000] flex items-end md:items-center justify-center overflow-hidden">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div 
                        key="app-detail-modal"
                        initial="hidden"
                        animate="enter"
                        exit="exit"
                        variants={variants}
                        className={`relative flex flex-col z-10 bg-[var(--bg-card)] pointer-events-auto ${
                            isMobile 
                            ? 'w-full h-auto max-h-[85vh] rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]' 
                            : 'w-[90%] max-w-[500px] max-h-[90vh] rounded-[24px] shadow-2xl border border-[var(--border-color)]'
                        }`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Mobile Drag Handle */}
                        {isMobile && <div className="w-12 h-1.5 rounded-full bg-[var(--border-color)] opacity-30 mx-auto mt-4 mb-2 shrink-0" />}

                        {/* Header */}
                        <div className={`px-6 py-5 flex justify-between items-center border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0 ${!isMobile ? 'rounded-t-[24px]' : 'rounded-t-[32px]'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--primary-main)]">
                                    <FileText size={20} />
                                </div>
                                <h5 className="font-black text-[var(--text-main)] text-xl tracking-tight leading-none mb-0">
                                    Application Details
                                </h5>
                            </div>
                            {!isMobile && (
                                <button 
                                    type="button" 
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] transition-all hover:bg-[var(--border-color)]/20 hover:scale-110 active:scale-95"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="px-6 py-8 overflow-y-auto custom-scroll">
                            {/* Job Info Card */}
                            <div className="p-5 mb-8 rounded-[24px] bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <h6 className="font-bold text-[var(--text-main)] text-lg mb-0 leading-tight">
                                        {selectedApp.job?.title}
                                    </h6>
                                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium">
                                        <Building2 size={14} />
                                        {selectedApp.job?.company?.name || 'Company Details'}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 py-3 border-t border-[var(--border-color)] border-dashed">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
                                        <MapPin size={14} className="text-[var(--primary-main)]" />
                                        {selectedApp.job?.city}, {selectedApp.job?.state}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
                                        <IndianRupee size={14} className="text-[var(--primary-main)]" />
                                        {formatSalary(selectedApp.job?.salaryMin, selectedApp.job?.salaryMax)}
                                    </div>
                                </div>
                            </div>

                            {/* Status & Date */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-1.5">
                                    <span className="font-black text-[0.6rem] uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-70">Current Status</span>
                                    <div className="mt-0.5">{getStatusBadge(selectedApp.status)}</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-1.5">
                                    <span className="font-black text-[0.6rem] uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-70">Applied On</span>
                                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
                                        <Calendar size={14} className="text-[var(--primary-main)]" />
                                        {formatDate(selectedApp.appliedAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Cover Note */}
                            <div className="flex flex-center gap-3 mb-4">
                                <span className="font-black text-[0.65rem] uppercase tracking-[0.2em] text-[var(--text-muted)] whitespace-nowrap">Your Cover Note</span>
                                <div className="grow h-px bg-[var(--border-color)] opacity-50" />
                            </div>
                            <div className="p-5 rounded-[24px] bg-[var(--bg-surface)] border border-[var(--border-color)] italic text-[var(--text-main)] text-sm font-medium leading-relaxed">
                                {selectedApp.coverNote || "No cover note provided for this application."}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`px-6 py-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] shrink-0 ${isMobile ? 'pb-[calc(1.5rem+env(safe-area-inset-bottom))]' : 'rounded-b-[24px]'}`}>
                            <Link 
                                href={`/jobs/${selectedApp.job?._id}`} 
                                className="relative overflow-hidden group auth-submit-btn !py-3.5 !px-10 rounded-2xl text-sm font-bold hover:opacity-90 active:scale-[0.98] shadow-xl shadow-[var(--primary-main)]/10 flex items-center justify-center gap-2 no-underline"
                            >
                                <ExternalLink size={18} />
                                View Full Job Posting
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
