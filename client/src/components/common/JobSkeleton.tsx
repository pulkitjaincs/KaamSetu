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
            <div className="d-flex gap-3 mb-4" style={{ alignItems: "flex-start" }}>
                {/* Logo */}
                <div className="placeholder-glow" style={{ flexShrink: 0 }}>
                    <div
                        className="placeholder"
                        style={{ width: "56px", height: "56px", borderRadius: "12px", backgroundColor: shimmerBg }}
                    />
                </div>
                {/* Company name + title */}
                <div className="flex-grow-1 placeholder-glow" style={{ minWidth: 0 }}>
                    <div
                        className="placeholder mb-2"
                        style={{ width: "35%", height: "12px", borderRadius: "6px", backgroundColor: shimmerBg, display: "block" }}
                    />
                    <div
                        className="placeholder"
                        style={{ width: "70%", height: "18px", borderRadius: "6px", backgroundColor: shimmerBg, display: "block" }}
                    />
                </div>
            </div>

            {/* Metadata grid skeleton */}
            <div
                className="placeholder-glow"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "16px",
                    borderTop: "1px solid var(--border-color)",
                    borderBottom: "1px solid var(--border-color)",
                    padding: "16px 0",
                    marginBottom: "16px",
                }}
            >
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div
                            className="placeholder"
                            style={{ width: "50%", height: "8px", borderRadius: "4px", backgroundColor: shimmerBg }}
                        />
                        <div
                            className="placeholder"
                            style={{ width: "70%", height: "14px", borderRadius: "4px", backgroundColor: shimmerBg }}
                        />
                    </div>
                ))}
            </div>

            {/* CTA skeleton */}
            <div className="placeholder-glow">
                <div
                    className="placeholder"
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
