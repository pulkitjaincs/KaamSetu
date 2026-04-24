"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    action?: React.ReactNode;
    defaultOpen?: boolean;
}

export default function CollapsibleSection({ 
    title, 
    icon, 
    children, 
    action,
    defaultOpen = false 
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // On desktop, it's always open and not toggleable as an accordion
    if (!isMobile) {
        return (
            <div className="mb-8">
                {children}
            </div>
        );
    }

    return (
        <div className="mb-4 overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)]">
            <div className="flex w-full items-center justify-between p-4 px-5">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex flex-1 items-center gap-3 text-left"
                >
                    <div className="flex items-center justify-center text-[var(--primary-main)]">
                        {icon}
                    </div>
                    <span className="text-base font-bold tracking-tight text-[var(--text-main)]">
                        {title}
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[var(--text-muted)]"
                    >
                        <ChevronDown size={18} />
                    </motion.div>
                </button>
                
                {action && (
                    <div className="ml-2" onClick={(e) => e.stopPropagation()}>
                        {action}
                    </div>
                )}
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="px-5 pb-5 pt-0">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
