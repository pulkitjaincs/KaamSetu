import { memo } from 'react';
import { Bookmark, Zap } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Job } from '@/types';

const logoStyle = { width: "56px", height: "56px", flexShrink: 0 };
const fallbackLogoBase = {
    width: "56px", height: "56px", flexShrink: 0,
    background: "linear-gradient(135deg, #0056b6, #006ee5)",
    color: "white", fontSize: "1.25rem"
};

interface CardProps {
    job: Job;
    isSelected: boolean;
    onClick: () => void;
}

const Card = memo(({ job, isSelected, onClick }: CardProps) => {

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
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`card ${isSelected ? 'selected' : ''}`}
            style={{
                cursor: "pointer",
                borderRadius: "24px",
                backgroundColor: isSelected ? "var(--bg-surface)" : "var(--bg-card)",
                border: isSelected ? "1px solid var(--border-active)" : "1px solid transparent",
                padding: "24px",
                willChange: "transform, opacity",
                transition: "background-color 0.2s ease, border-color 0.2s ease",
            }}
        >
            {/* Header: Logo + Company + Title + Bookmark */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "16px", minWidth: 0 }}>
                    {/* Company Logo */}
                    <div style={{ ...logoStyle, borderRadius: "12px", overflow: "hidden", background: "var(--bg-surface)", flexShrink: 0 }}>
                        {job.company?.logo ? (
                            <Image
                                src={job.company.logo}
                                alt={job.company?.name || job.title}
                                width={56}
                                height={56}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                unoptimized
                            />
                        ) : (
                            <div
                                style={{
                                    ...fallbackLogoBase,
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                }}
                            >
                                {job.company?.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                    {/* Company name + title */}
                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                color: "var(--text-muted)",
                            }}>
                                {job.company?.name || 'Company'}
                            </span>
                        </div>
                        <h4 style={{
                            fontSize: "1.15rem",
                            fontWeight: 700,
                            color: "var(--text-main)",
                            lineHeight: 1.3,
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}>
                            {job.title}
                        </h4>
                    </div>
                </div>
                {/* Bookmark icon */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: "4px",
                        flexShrink: 0,
                        transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#0056b6')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                    <Bookmark style={{ width: "1.2rem", height: "1.2rem" }} />
                </button>
            </div>

            {/* Metadata Grid: Location / Salary / Shift */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
                borderTop: "1px solid var(--border-color)",
                borderBottom: "1px solid var(--border-color)",
                padding: "16px 0",
                marginBottom: "16px",
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "var(--text-muted)",
                        opacity: 0.7,
                    }}>
                        Location
                    </span>
                    <span style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-main)",
                    }}>
                        {job.city}{job.state ? `, ${job.state}` : ''}
                    </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "var(--text-muted)",
                        opacity: 0.7,
                    }}>
                        Salary
                    </span>
                    <span style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#0056b6",
                    }}>
                        {salaryDisplay}
                    </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "var(--text-muted)",
                        opacity: 0.7,
                    }}>
                        Type
                    </span>
                    <span style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-main)",
                    }}>
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
                style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #0056b6 0%, #006ee5 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px",
                    fontFamily: "var(--font-plus-jakarta), 'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 12px rgba(0, 86, 182, 0.2)",
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                Quick Apply
                <Zap style={{ width: "1rem", height: "1rem", fill: "currentColor" }} />
            </button>
        </motion.div>
    );
});

Card.displayName = 'Card';

export default Card;
