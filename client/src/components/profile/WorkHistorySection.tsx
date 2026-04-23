import { memo } from 'react';
import { formatDate } from '@/utils/index';
import { WorkExperience } from '@/types';
import { Star, Plus, BadgeCheck, EyeOff, SquarePen } from 'lucide-react';

interface WorkHistorySectionProps {
    workHistory: WorkExperience[];
    isOwnProfile: boolean;
    onAddClick: () => void;
    onExpClick: (exp: WorkExperience) => void;
}

const sectionCardStyle = {
    background: 'var(--surface-container-lowest)',
    borderRadius: '24px',
    position: 'relative' as const,
    overflow: 'hidden'
};

const verifiedBadgeStyle = {
    background: 'rgba(0, 100, 102, 0.1)',
    color: 'var(--tertiary)',
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    border: 'none'
};

const hiddenBadgeStyle = {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '0.65rem',
    border: '1px solid var(--border-color)'
};

function StarRating({ rating }: { rating?: number }) {
    if (!rating) return null;
    const full = Math.floor(rating);
    const empty = 5 - full;
    return (
        <div className="flex items-center gap-2 mt-1 mb-2">
            <div className="flex" style={{ color: '#f59e0b', gap: '1px' }}>
                {Array.from({ length: full }).map((_, i) => (
                    <Star key={i} style={{ width: '0.75rem', height: '0.75rem', fill: 'currentColor' }} />
                ))}
                {Array.from({ length: empty }).map((_, i) => (
                    <Star key={i} style={{ width: '0.75rem', height: '0.75rem' }} />
                ))}
            </div>
            <span className="font-bold rounded-md"
                style={{
                    fontSize: '0.65rem',
                    background: 'var(--surface-container-high)',
                    color: 'var(--text-muted)',
                    padding: '2px 6px'
                }}>
                {rating.toFixed(1)}
            </span>
        </div>
    );
}

const WorkHistorySection = memo(({ workHistory, isOwnProfile, onAddClick, onExpClick }: WorkHistorySectionProps) => (
    <section>
        <div className="flex justify-between items-center px-1 mb-4">
            <h3 className="font-bold mb-0"
                style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Employment History
            </h3>
            {isOwnProfile && (
                <button
                    className="font-bold"
                    style={{ color: 'var(--primary-main)', background: 'none', border: 'none', fontSize: '0.85rem' }}
                    onClick={onAddClick}>
                    <Plus className="mr-1 inline-block" style={{ width: '1rem', height: '1rem', verticalAlign: 'text-bottom' }} /> Add Experience
                </button>
            )}
        </div>

        <div className="flex flex-col gap-3">
            {workHistory.length > 0 ? (
                [...workHistory]
                    .filter(exp => exp.isVisible || isOwnProfile)
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((exp: WorkExperience) => (
                        <div key={exp._id} className="p-4" style={{
                            ...sectionCardStyle,
                            opacity: (exp.isVisible === false && isOwnProfile) ? 0.6 : 1,
                            cursor: isOwnProfile ? 'pointer' : 'default',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                            onClick={() => isOwnProfile && onExpClick(exp)}
                        >
                            {/* Verified badge — top-right absolute */}
                            <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                                {exp.isVerified && (
                                    <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={verifiedBadgeStyle}>
                                        <BadgeCheck style={{ width: '0.75rem', height: '0.75rem' }} />
                                        Verified
                                    </span>
                                )}
                                {exp.isVisible === false && isOwnProfile && (
                                    <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={hiddenBadgeStyle}>
                                        <EyeOff style={{ width: '0.75rem', height: '0.75rem' }} />
                                        Hidden
                                    </span>
                                )}
                            </div>

                            <div className="pr-10">
                                {/* Company + role + dates */}
                                <div className="mb-2">
                                    <h4 className="font-bold mb-0"
                                        style={{ fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                                        {exp.companyName || exp.company?.name || 'Unknown Company'}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-bold" style={{ color: 'var(--primary-main)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            {exp.role}
                                        </span>
                                        <span className="text-[var(--text-muted)]" style={{ fontSize: '0.8rem' }}>•</span>
                                        <span className="text-[var(--text-muted)] font-medium" style={{ fontSize: '0.8rem' }}>
                                            {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                        </span>
                                    </div>
                                </div>

                                {/* Star rating (if available) - compact version */}
                                <StarRating rating={(exp as WorkExperience & { rating?: number }).rating} />

                                {/* Testimonial / description */}
                                {exp.description && (
                                    <blockquote className="mb-0 pl-3 mt-1"
                                        style={{
                                            borderLeft: '3px solid var(--surface-container-high)',
                                            color: 'var(--text-muted)',
                                            lineHeight: 1.6,
                                            fontSize: '0.825rem'
                                        }}>
                                        &ldquo;{exp.description}&rdquo;
                                    </blockquote>
                                )}

                                {/* Edit Hint */}
                                {isOwnProfile && (
                                    <div className="absolute bottom-3 right-3">
                                        <SquarePen className="opacity-25" style={{ width: '0.75rem', height: '0.75rem', color: 'var(--primary-main)' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
            ) : (
                <div className="p-4 rounded-3xl text-center"
                    style={{ background: 'var(--surface-container-low)', border: '2px dashed var(--border-color)' }}>
                    <p className="text-[var(--text-muted)] mb-0 text-sm">Your work journey starts here. Add your first experience.</p>
                </div>
            )}
        </div>
    </section>
));

WorkHistorySection.displayName = 'WorkHistorySection';
export default WorkHistorySection;
