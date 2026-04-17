import { memo } from 'react';
import { formatDate } from '@/utils/index';
import { WorkExperience } from '@/types';

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
        <div className="d-flex align-items-center gap-2 mt-1 mb-2">
            <div className="d-flex" style={{ color: '#f59e0b', gap: '1px' }}>
                {Array.from({ length: full }).map((_, i) => (
                    <i key={i} className="bi bi-star-fill" style={{ fontSize: '0.75rem' }}></i>
                ))}
                {Array.from({ length: empty }).map((_, i) => (
                    <i key={i} className="bi bi-star" style={{ fontSize: '0.75rem' }}></i>
                ))}
            </div>
            <span className="fw-bold rounded-md"
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
        <div className="d-flex justify-content-between align-items-center px-1 mb-4">
            <h3 className="fw-bold mb-0"
                style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Employment History
            </h3>
            {isOwnProfile && (
                <button
                    className="btn btn-sm fw-bold text-decoration-none"
                    style={{ color: 'var(--primary-main)', background: 'none', border: 'none', fontSize: '0.85rem' }}
                    onClick={onAddClick}>
                    <i className="bi bi-plus-lg me-1"></i> Add Experience
                </button>
            )}
        </div>

        <div className="d-flex flex-column gap-3">
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
                            <div className="position-absolute top-0 end-0 p-3 d-flex flex-column align-items-end gap-2">
                                {exp.isVerified && (
                                    <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-full" style={verifiedBadgeStyle}>
                                        <i className="bi bi-patch-check-fill" style={{ fontSize: '0.75rem' }}></i>
                                        Verified
                                    </span>
                                )}
                                {exp.isVisible === false && isOwnProfile && (
                                    <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-full" style={hiddenBadgeStyle}>
                                        <i className="bi bi-eye-slash" style={{ fontSize: '0.75rem' }}></i>
                                        Hidden
                                    </span>
                                )}
                            </div>

                            <div className="pe-5">
                                {/* Company + role + dates */}
                                <div className="mb-2">
                                    <h4 className="fw-bold mb-0"
                                        style={{ fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                                        {exp.companyName || exp.company?.name || 'Unknown Company'}
                                    </h4>
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <span className="fw-bold text-primary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            {exp.role}
                                        </span>
                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>•</span>
                                        <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>
                                            {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                        </span>
                                    </div>
                                </div>

                                {/* Star rating (if available) - compact version */}
                                <StarRating rating={(exp as WorkExperience & { rating?: number }).rating} />

                                {/* Testimonial / description */}
                                {exp.description && (
                                    <blockquote className="mb-0 ps-3 mt-1"
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
                                    <div className="position-absolute bottom-0 end-0 p-3">
                                        <i className="bi bi-pencil-square text-primary opacity-25" style={{ fontSize: '0.75rem' }}></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
            ) : (
                <div className="p-4 rounded-3xl text-center"
                    style={{ background: 'var(--surface-container-low)', border: '2px dashed var(--border-color)' }}>
                    <p className="text-muted mb-0 small">Your work journey starts here. Add your first experience.</p>
                </div>
            )}
        </div>
    </section>
));

WorkHistorySection.displayName = 'WorkHistorySection';
export default WorkHistorySection;
