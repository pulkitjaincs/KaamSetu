import { memo } from 'react';
import { motion } from 'framer-motion';

const shimmerBg = "var(--bg-surface)";

const JobSkeleton = memo(() => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card pointer-events-none"
        >
            {/* Header skeleton: logo + text */}
            <div className="flex gap-4 mb-5 items-start">
                {/* Logo */}
                <div className="shrink-0">
                    <div
                        className="animate-pulse w-14 h-14 rounded-xl"
                        style={{ backgroundColor: shimmerBg }}
                    />
                </div>
                {/* Company name + title */}
                <div className="grow min-w-0">
                    <div
                        className="animate-pulse mb-2 w-[35%] h-3 rounded-md"
                        style={{ backgroundColor: shimmerBg }}
                    />
                    <div
                        className="animate-pulse w-[70%] h-5 rounded-md"
                        style={{ backgroundColor: shimmerBg }}
                    />
                </div>
            </div>

            {/* Metadata grid skeleton */}
            <div
                className="grid grid-cols-3 gap-4 border-y border-[var(--border-color)] py-4 mb-4"
            >
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div
                            className="animate-pulse w-1/2 h-2 rounded-sm"
                            style={{ backgroundColor: shimmerBg }}
                        />
                        <div
                            className="animate-pulse w-[70%] h-3.5 rounded-sm"
                            style={{ backgroundColor: shimmerBg }}
                        />
                    </div>
                ))}
            </div>

            {/* CTA skeleton */}
            <div
                className="animate-pulse w-full h-[48px] rounded-xl"
                style={{ backgroundColor: shimmerBg }}
            />
        </motion.div>
    );
});

JobSkeleton.displayName = 'JobSkeleton';

export default JobSkeleton;
