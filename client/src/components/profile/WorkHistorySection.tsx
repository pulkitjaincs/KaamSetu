import { memo, useState, useEffect } from 'react';
import { formatDate } from '@/utils/index';
import { WorkExperience } from '@/types';
import { Star, Plus, BadgeCheck, EyeOff, SquarePen } from 'lucide-react';

interface WorkHistorySectionProps {
    workHistory: WorkExperience[];
    isOwnProfile: boolean;
    onAddClick: () => void;
    onExpClick: (exp: WorkExperience) => void;
}




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

import CollapsibleSection from '../common/CollapsibleSection';
import { Briefcase } from 'lucide-react';

const WorkHistorySection = memo(({ workHistory, isOwnProfile, onAddClick, onExpClick }: WorkHistorySectionProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const sectionHeader = (
        <div className="flex justify-between items-center px-1 mb-4 lg:flex hidden">
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
    );

    const addAction = isOwnProfile ? (
        <button
            className="font-bold p-2"
            style={{ color: 'var(--primary-main)', background: 'none', border: 'none', fontSize: '0.75rem' }}
            onClick={onAddClick}>
            <Plus className="inline-block" style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
    ) : null;

    const experienceList = (
        <div className="flex flex-col" style={!isMobile ? { 
            background: 'var(--bg-card)', 
            borderRadius: '24px', 
            border: '1px solid var(--border-color)',
            overflow: 'hidden' 
        } : {}}>
            {workHistory.length > 0 ? (
                [...workHistory]
                    .filter(exp => exp.isVisible || isOwnProfile)
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((exp: WorkExperience, index, array) => (
                        <div key={exp._id} 
                            className="p-5 transition-all hover:bg-[var(--surface-container-low)]" 
                            style={{
                                opacity: (exp.isVisible === false && isOwnProfile) ? 0.6 : 1,
                                cursor: isOwnProfile ? 'pointer' : 'default',
                                borderBottom: index < array.length - 1 ? '1px solid var(--border-color)' : 'none',
                                position: 'relative'
                            }}
                            onClick={() => isOwnProfile && onExpClick(exp)}
                        >
                            {/* Verified badge — top-right absolute */}
                            <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
                                {exp.isVerified && (
                                    <span className="flex items-center gap-1 px-3 py-1 rounded-full font-bold uppercase tracking-wider" 
                                        style={{ ...verifiedBadgeStyle, fontSize: '0.6rem' }}>
                                        <BadgeCheck style={{ width: '0.8rem', height: '0.8rem' }} />
                                        Verified
                                    </span>
                                )}
                                {exp.isVisible === false && isOwnProfile && (
                                    <span className="flex items-center gap-1 px-3 py-1 rounded-full font-bold" 
                                        style={{ ...hiddenBadgeStyle, fontSize: '0.6rem' }}>
                                        <EyeOff style={{ width: '0.8rem', height: '0.8rem' }} />
                                        Hidden
                                    </span>
                                )}
                            </div>

                            <div className="pr-12">
                                {/* Company + role + dates */}
                                <div className="mb-3">
                                    <h4 className="font-bold mb-1"
                                        style={{ fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                                        {exp.companyName || exp.company?.name || 'Unknown Company'}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <span className="font-bold text-xs uppercase tracking-widest" style={{ color: 'var(--primary-main)' }}>
                                            {exp.role}
                                        </span>
                                        <span className="text-[var(--text-muted)] hidden sm:inline opacity-30">•</span>
                                        <span className="text-[var(--text-muted)] font-medium text-sm">
                                            {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                        </span>
                                    </div>
                                </div>

                                {/* Star rating (if available) - compact version */}
                                <StarRating rating={(exp as WorkExperience & { rating?: number }).rating} />

                                {/* Testimonial / description */}
                                {exp.description && (
                                    <div className="relative pl-4 py-1">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-[var(--primary-main)] opacity-10" />
                                        <p className="mb-0 italic leading-relaxed"
                                            style={{
                                                color: 'var(--text-muted)',
                                                fontSize: '0.875rem'
                                            }}>
                                            &ldquo;{exp.description}&rdquo;
                                        </p>
                                    </div>
                                )}

                                {/* Edit Hint - subtle icon */}
                                {isOwnProfile && (
                                    <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <SquarePen size={14} className="text-[var(--primary-main)]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
            ) : (
                <div className="p-8 text-center" style={{ background: 'var(--surface-container-lowest)' }}>
                    <div className="w-12 h-12 bg-[var(--surface-container-high)] rounded-full flex items-center justify-center mx-auto mb-3 opacity-20">
                        <Briefcase size={24} />
                    </div>
                    <p className="text-[var(--text-muted)] mb-0 text-sm font-medium">Your work journey starts here. Add your first experience.</p>
                </div>
            )}
        </div>
    );

    return (
        <section>
            {sectionHeader}
            <CollapsibleSection 
                title="Employment History" 
                icon={<Briefcase size={20} />}
                action={addAction}
                defaultOpen={true}
            >
                {experienceList}
            </CollapsibleSection>
        </section>
    );
});

WorkHistorySection.displayName = 'WorkHistorySection';
export default WorkHistorySection;
