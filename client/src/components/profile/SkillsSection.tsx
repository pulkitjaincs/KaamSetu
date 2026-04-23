import { memo } from 'react';
import Link from 'next/link';
import { Wrench, Plus, Languages } from 'lucide-react';

interface SkillsSectionProps {
    skills?: string[];
    languages?: string[];
    isOwnProfile: boolean;
}

const chipStyle = {
    background: 'var(--surface-container-lowest)',
    color: 'var(--text-main)',
    fontSize: '0.875rem',
    fontWeight: 500,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: 'none'
};

const tileStyle = {
    background: 'var(--surface-container-low)',
    borderRadius: '24px'
};

const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--primary-main)'
};

const SkillsSection = memo(({ skills, languages, isOwnProfile }: SkillsSectionProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Expertise Tile */}
        <div>
            <div className="p-4 h-full" style={tileStyle}>
                <div className="flex items-center gap-2 mb-4">
                    <Wrench className="text-xl" style={{ color: 'var(--primary-main)', width: '1.25rem', height: '1.25rem' }} />
                    <span style={labelStyle}>Expertise</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skills && skills.length > 0 ? (
                        skills.map((skill, i) => (
                            <span key={i} className="rounded-full px-4 py-2" style={chipStyle}>
                                {skill}
                            </span>
                        ))
                    ) : (
                        <p className="text-[var(--text-muted)] text-sm mb-0 italic">No skills added yet.</p>
                    )}
                    {isOwnProfile && (
                        <Link href="/profile/edit"
                            className="rounded-full px-4 py-2 no-underline"
                            style={{ ...chipStyle, color: 'var(--primary-main)', border: '1.5px dashed var(--primary-main)', background: 'transparent' }}>
                            <Plus className="inline-block" style={{ width: '1rem', height: '1rem', verticalAlign: 'text-bottom' }} /> Add
                        </Link>
                    )}
                </div>
            </div>
        </div>

        {/* Languages Tile */}
        <div>
            <div className="p-4 h-full" style={tileStyle}>
                <div className="flex items-center gap-2 mb-4">
                    <Languages className="text-xl" style={{ color: 'var(--primary-main)', width: '1.25rem', height: '1.25rem' }} />
                    <span style={labelStyle}>Languages</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {languages && languages.length > 0 ? (
                        languages.map((lang, i) => (
                            <span key={i} className="rounded-full px-4 py-2" style={chipStyle}>
                                {lang}
                            </span>
                        ))
                    ) : (
                        <p className="text-[var(--text-muted)] text-sm mb-0 italic">No languages added yet.</p>
                    )}
                    {isOwnProfile && (
                        <Link href="/profile/edit"
                            className="rounded-full px-4 py-2 no-underline"
                            style={{ ...chipStyle, color: 'var(--primary-main)', border: '1.5px dashed var(--primary-main)', background: 'transparent' }}>
                            <Plus className="inline-block" style={{ width: '1rem', height: '1rem', verticalAlign: 'text-bottom' }} /> Add
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </div>
));

SkillsSection.displayName = 'SkillsSection';
export default SkillsSection;
