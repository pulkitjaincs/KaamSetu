import { memo } from 'react';
import Link from 'next/link';

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
    borderRadius: '20px'
};

const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--primary-main)'
};

const SkillsSection = memo(({ skills, languages, isOwnProfile }: SkillsSectionProps) => (
    <div className="row g-4 mb-4">
        {/* Expertise Tile */}
        <div className="col-12 col-md-6">
            <div className="p-4 h-100" style={tileStyle}>
                <div className="d-flex align-items-center gap-2 mb-4">
                    <i className="bi bi-tools text-primary fs-5"></i>
                    <span style={labelStyle}>Expertise</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    {skills && skills.length > 0 ? (
                        skills.map((skill, i) => (
                            <span key={i} className="badge rounded-pill px-4 py-2" style={chipStyle}>
                                {skill}
                            </span>
                        ))
                    ) : (
                        <p className="text-muted small mb-0 fst-italic">No skills added yet.</p>
                    )}
                    {isOwnProfile && (
                        <Link href="/profile/edit"
                            className="badge rounded-pill px-4 py-2 text-decoration-none"
                            style={{ ...chipStyle, color: 'var(--primary-main)', border: '1.5px dashed var(--primary-main)', background: 'transparent' }}>
                            <i className="bi bi-plus"></i> Add
                        </Link>
                    )}
                </div>
            </div>
        </div>

        {/* Languages Tile */}
        <div className="col-12 col-md-6">
            <div className="p-4 h-100" style={tileStyle}>
                <div className="d-flex align-items-center gap-2 mb-4">
                    <i className="bi bi-translate text-primary fs-5"></i>
                    <span style={labelStyle}>Languages</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    {languages && languages.length > 0 ? (
                        languages.map((lang, i) => (
                            <span key={i} className="badge rounded-pill px-4 py-2" style={chipStyle}>
                                {lang}
                            </span>
                        ))
                    ) : (
                        <p className="text-muted small mb-0 fst-italic">No languages added yet.</p>
                    )}
                    {isOwnProfile && (
                        <Link href="/profile/edit"
                            className="badge rounded-pill px-4 py-2 text-decoration-none"
                            style={{ ...chipStyle, color: 'var(--primary-main)', border: '1.5px dashed var(--primary-main)', background: 'transparent' }}>
                            <i className="bi bi-plus"></i> Add
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </div>
));

SkillsSection.displayName = 'SkillsSection';
export default SkillsSection;
