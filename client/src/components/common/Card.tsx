import { memo, useState } from 'react';
import { Bookmark, Zap } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Job } from '@/types';

interface CardProps {
    job: Job;
    isSelected: boolean;
    onClick: () => void;
}

const Card = memo(({ job, isSelected, onClick }: CardProps) => {
    const [imageError, setImageError] = useState(false);

    const salaryDisplay = (() => {
        const min = job.salaryMin;
        const max = job.salaryMax;
        if (!min) return '–';
        const fmt = (n: number) => n >= 100000 ? `₹${(n / 1000).toFixed(0)}k` : `₹${n.toLocaleString()}`;
        return max ? `${fmt(min)} - ${fmt(max)}` : `${fmt(min)}+`;
    })();

    const shiftLabel = job.shift
        ? job.shift.charAt(0).toUpperCase() + job.shift.slice(1)
        : job.jobType
            ? job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)
            : '–';

    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`card ${isSelected ? 'selected' : ''} group`}
        >
            {/* Header: Logo + Company + Title + Bookmark */}
            <div className="flex justify-between items-start mb-5">
                <div className="flex gap-4 min-w-0">
                    {/* Company Logo */}
                    {!imageError && (
                        <div className="card-logo">
                            {job.company?.logo ? (
                                <Image
                                    src={job.company.logo}
                                    alt={job.company?.name || job.title}
                                    width={56}
                                    height={56}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="card-fallback-logo">
                                    {job.company?.name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Company name + title */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="card-company">
                                {job.company?.name || 'Company'}
                            </span>
                        </div>
                        <h4 className="card-title line-clamp-2">
                            {job.title}
                        </h4>
                    </div>
                </div>
                {/* Bookmark icon */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 shrink-0 text-[var(--text-muted)] hover:text-[var(--primary-main)] transition-colors border-none bg-transparent cursor-pointer"
                >
                    <Bookmark className="w-[1.2rem] h-[1.2rem]" />
                </button>
            </div>

            {/* Metadata Grid: Location / Salary / Shift */}
            <div className="grid grid-cols-3 gap-4 border-y border-[var(--border-color)] py-4 mb-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] opacity-70">
                        Location
                    </span>
                    <span className="text-[0.85rem] font-semibold text-[var(--text-main)] truncate">
                        {job.city}{job.state ? `, ${job.state}` : ''}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] opacity-70">
                        Salary
                    </span>
                    <span className="text-[0.85rem] font-semibold text-[var(--primary-main)]">
                        {salaryDisplay}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] opacity-70">
                        Type
                    </span>
                    <span className="text-[0.85rem] font-semibold text-[var(--text-main)]">
                        {shiftLabel}
                    </span>
                </div>
            </div>

            {/* Quick Apply CTA */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                className="w-full bg-[var(--primary-main)] text-white rounded-xl py-3.5 font-bold text-[0.75rem] uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-md shadow-[var(--ring-overlay)] border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
            >
                Quick Apply
                <Zap className="w-4 h-4 fill-current" />
            </button>
        </motion.div>
    );
});

Card.displayName = 'Card';

export default Card;
