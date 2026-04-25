"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Send, X, MessageSquareQuote } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { TextAreaField } from '@/components/common/FormComponents';

interface ApplyModalProps {
    show: boolean;
    onClose: () => void;
    onApply: (coverNote: string) => void;
    applying: boolean;
}

export default function ApplyModal({ show, onClose, onApply, applying }: ApplyModalProps) {
    const [coverNote, setCoverNote] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!show) return;

        // Only lock background scroll on mobile.
        // On desktop, the fixed overlay + backdrop already blocks interaction.
        // Locking body overflow on desktop causes framer-motion layout
        // animations to misfire (the listing panel jumps upward).
        const mobile = window.innerWidth < 1024;
        if (!mobile) return;

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

    const modalContent = (
        <AnimatePresence>
            {show && (
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
                        key="apply-modal"
                        initial="hidden"
                        animate="enter"
                        exit="exit"
                        variants={variants}
                        className={`relative flex flex-col z-10 bg-[var(--bg-card)] pointer-events-auto ${isMobile
                            ? 'w-full h-auto max-h-[85vh] rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]'
                            : 'w-[90%] max-w-[500px] max-h-[90vh] rounded-[24px] shadow-2xl border border-[var(--border-color)]'
                            }`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Mobile Drag Handle */}
                        {isMobile && <div className="w-12 h-1.5 rounded-full bg-[var(--border-color)] opacity-30 mx-auto mt-4 mb-2 shrink-0" />}

                        {/* Sticky Header */}
                        <div className={`px-6 py-5 flex justify-between items-center border-b border-[var(--border-color)] shrink-0 ${!isMobile ? 'rounded-t-[24px]' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--primary-main)]/10 flex items-center justify-center text-[var(--primary-main)]">
                                    <Send size={20} />
                                </div>
                                <h5 className="font-black text-[var(--text-main)] text-xl tracking-tight leading-none mb-0">
                                    Apply for Job
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
                            {/* Intro Card */}
                            <div className="p-5 mb-8 rounded-[24px] bg-[var(--bg-surface)] border border-[var(--border-color)] relative overflow-hidden group">
                                <div className="absolute -right-2 -top-2 opacity-5 group-hover:scale-110 transition-transform">
                                    <MessageSquareQuote size={80} />
                                </div>
                                <div className="relative z-10">
                                    <span className="font-black text-[0.65rem] uppercase tracking-[0.2em] text-[var(--primary-main)] opacity-70 block mb-1">Application Tip</span>
                                    <p className="text-[var(--text-muted)] text-xs font-medium leading-relaxed m-0">
                                        Adding a personalized cover note significantly increases your chances of getting noticed by employers.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <TextAreaField
                                    label="Cover Note (Optional)"
                                    name="coverNote"
                                    value={coverNote}
                                    onChange={(e) => setCoverNote(e.target.value)}
                                    rows={5}
                                    placeholder="Briefly explain why you're a good fit for this role..."
                                    maxLength={500}
                                    sm={true}
                                />
                                <div className="flex justify-end">
                                    <span className={`text-[0.65rem] font-black tracking-widest uppercase ${coverNote.length >= 450 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                        {coverNote.length} / 500
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`px-6 py-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] shrink-0 flex items-center gap-4 ${isMobile ? 'pb-[calc(1.5rem+env(safe-area-inset-bottom))]' : 'rounded-b-[24px]'}`}>
                            <button
                                className="px-6 py-3 text-[0.8rem] font-black uppercase tracking-[0.1em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <div className="flex-1" />

                            <button
                                onClick={() => onApply(coverNote)}
                                disabled={applying}
                                className="relative overflow-hidden group auth-submit-btn !py-3.5 !px-10 rounded-2xl text-sm font-bold hover:opacity-90 active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[var(--primary-main)]/10"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                    {!applying && <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    if (!mounted) return null;
    return createPortal(modalContent, document.body);
}
