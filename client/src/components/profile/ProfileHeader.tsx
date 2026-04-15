import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getInitials } from '@/utils/index';
import { Profile } from '@/types';

interface ProfileHeaderProps {
    profile: Profile;
    isOwnProfile: boolean;
    isEmployer: boolean;
    completionPercent: number;
    getAge: (dob: string) => number;
}

const ProfileHeader = memo(({ profile, isOwnProfile, isEmployer, completionPercent, getAge }: ProfileHeaderProps) => {
    const avatarSrc = profile.avatarUrl || profile.avatar;
    const isVerified = !!profile.documents?.aadhaar?.verified;
    const roleSubtitle = isEmployer
        ? profile.designation || 'Employer'
        : [profile.skills?.[0] || 'Worker', profile.totalExperienceYears ? `${profile.totalExperienceYears}+ Years Exp.` : null]
            .filter(Boolean).join(' • ');

    return (
        <>
            {/* Profile Identity Block */}
            <section className="mb-6" style={{ marginBottom: '2rem' }}>
                <div className="d-flex align-items-start justify-content-between gap-4 flex-wrap mb-5">
                    <div className="d-flex align-items-center gap-4">
                        {/* Avatar */}
                        <div className="position-relative flex-shrink-0"
                            style={{ width: '80px', height: '80px' }}>
                            <div className="w-100 h-100 rounded-4 overflow-hidden d-flex align-items-center justify-content-center position-relative"
                                style={{ background: 'var(--surface-container-low)', borderRadius: '24px' }}>
                                {avatarSrc?.startsWith('http') ? (
                                    <Image
                                        src={avatarSrc}
                                        alt={profile.name}
                                        fill
                                        sizes="80px"
                                        style={{ objectFit: 'cover' }}
                                        unoptimized={true}
                                    />
                                ) : (
                                    <span className="fw-bold fs-3" style={{ color: 'var(--primary-main)' }}>
                                        {getInitials(profile.name)}
                                    </span>
                                )}
                            </div>
                            {isVerified && (
                                <div className="position-absolute bottom-0 end-0 rounded-circle border border-3 border-white d-flex align-items-center justify-content-center"
                                    style={{ width: '22px', height: '22px', background: 'var(--tertiary-container)' }}>
                                    <i className="bi bi-check-lg text-white" style={{ fontSize: '10px' }}></i>
                                </div>
                            )}
                        </div>

                        {/* Name + Badge + Subtitle */}
                        <div>
                            <div className="d-flex align-items-center gap-3 mb-1">
                                <h1 className="fw-extrabold mb-0"
                                    style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                                    {profile.name}
                                </h1>
                                {isVerified && (
                                    <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                                        style={{
                                            background: 'var(--tertiary-container)',
                                            color: '#ffffff',
                                            fontSize: '0.625rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            lineHeight: 1
                                        }}>
                                        <i className="bi bi-patch-check-fill" style={{ fontSize: '0.75rem' }}></i>
                                        Verified
                                    </span>
                                )}
                            </div>
                            <p className="mb-0 fw-medium" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                {roleSubtitle}
                            </p>
                            {(profile.city || profile.state) && (
                                <p className="mb-0 small mt-1" style={{ color: 'var(--text-muted)' }}>
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {[profile.city, profile.state].filter(Boolean).join(', ')}
                                    {profile.dob ? ` • ${getAge(profile.dob)} yrs` : ''}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-3 align-items-center">
                        {isOwnProfile && (
                            <Link href="/profile/edit"
                                className="btn px-5 py-2 fw-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #0056b6 0%, #006ee5 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 20px 40px rgba(0,86,182,0.15)'
                                }}>
                                Edit Profile
                            </Link>
                        )}
                        <button
                            className="btn px-4 py-2"
                            style={{
                                background: 'var(--surface-container-low)',
                                color: 'var(--text-main)',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                            <i className="bi bi-share me-2"></i>Share
                        </button>
                    </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                    <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '680px' }}>
                        {profile.bio}
                    </p>
                )}
            </section>

            {/* Profile Completion Card — only own profile, incomplete */}
            {isOwnProfile && !isEmployer && completionPercent < 100 && (
                <div className="p-4 rounded-4 mb-5"
                    style={{ background: 'var(--surface-container-lowest)', border: 'none' }}>
                    <div className="d-flex justify-content-between align-items-end mb-3">
                        <span className="fw-bold small" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Profile Completion
                        </span>
                        <span className="fw-extrabold" style={{ fontSize: '1.75rem', color: 'var(--primary-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                            {completionPercent}%
                        </span>
                    </div>
                    <div className="w-100 rounded-pill overflow-hidden mb-3" style={{ height: '10px', background: 'var(--surface-container)' }}>
                        <div className="h-100 rounded-pill"
                            style={{
                                width: `${completionPercent}%`,
                                background: 'linear-gradient(135deg, #0056b6 0%, #006ee5 100%)',
                                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        />
                    </div>
                    <p className="small mb-0 p-3 rounded-3" style={{ background: 'rgba(0,86,182,0.06)', color: 'var(--text-muted)' }}>
                        <span className="fw-bold" style={{ color: 'var(--primary-main)' }}>Pro Tip:</span>
                        {' '}Add your PAN Card to reach up to 100% and get priority job listings.
                    </p>
                </div>
            )}
        </>
    );
});

ProfileHeader.displayName = 'ProfileHeader';
export default ProfileHeader;
