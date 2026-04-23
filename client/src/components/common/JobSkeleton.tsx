import { memo } from 'react';
import { motion } from 'framer-motion';

const shimmerBg = "var(--bg-surface)";

const JobSkeleton = memo(() => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                borderRadius: "16px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid transparent",
                padding: "24px",
                overflow: 'hidden'
            }}
        >
            {/* Header skeleton: logo + text */}
            <div className="flex gap-3 mb-4 items-start">
                {/* Logo */}
                <div className="shrink-0">
                    <div
                        className="animate-pulse"
                        style={{ width: "56px", height: "56px", borderRadius: "12px", backgroundColor: shimmerBg }}
                    />
                </div>
                {/* Company name + title */}
                <div className="grow min-w-0">
                    <div
                        className="animate-pulse mb-2"
                        style={{ width: "35%", height: "12px", borderRadius: "6px", backgroundColor: shimmerBg, display: "block" }}
                    />
                    <div
                        className="animate-pulse"
                        style={{ width: "70%", height: "18px", borderRadius: "6px", backgroundColor: shimmerBg, display: "block" }}
                    />
                </div>
            </div>

            {/* Metadata grid skeleton */}
            <div
                className="grid grid-cols-3 gap-4 border-t border-b border-[var(--border-color)] py-4 mb-4"
            >
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                        <div
                            className="animate-pulse"
                            style={{ width: "50%", height: "8px", borderRadius: "4px", backgroundColor: shimmerBg }}
                        />
                        <div
                            className="animate-pulse"
                            style={{ width: "70%", height: "14px", borderRadius: "4px", backgroundColor: shimmerBg }}
                        />
                    </div>
                ))}
            </div>

            {/* CTA skeleton */}
            <div>
                <div
                    className="animate-pulse"
                    style={{
                        width: "100%",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: shimmerBg,
                        display: "block"
                    }}
                />
            </div>
        </motion.div>
    );
});

JobSkeleton.displayName = 'JobSkeleton';

export default JobSkeleton;
