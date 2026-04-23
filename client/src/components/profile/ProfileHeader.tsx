import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getInitials } from '@/utils/index';
import { Profile } from '@/types';
import { Check, BadgeCheck, MapPin, Share2 } from 'lucide-react';

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
                <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0"
                            style={{ width: '80px', height: '80px' }}>
                            <div className="w-full h-full rounded-3xl overflow-hidden flex items-center justify-center relative"
                                style={{ background: 'var(--surface-container-low)' }}>
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
                                    <span className="font-bold text-3xl" style={{ color: 'var(--primary-main)' }}>
                                        {getInitials(profile.name)}
                                    </span>
                                )}
                            </div>
                            {isVerified && (
                                <div className="absolute bottom-0 right-0 rounded-full border-[3px] border-white flex items-center justify-center"
                                    style={{ width: '22px', height: '22px', background: 'var(--tertiary-container)' }}>
                                    <Check className="text-white" style={{ width: '12px', height: '12px' }} strokeWidth={4} />
                                </div>
                            )}
                        </div>

                        {/* Name + Badge + Subtitle */}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="font-extrabold mb-0"
                                    style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                                    {profile.name}
                                </h1>
                                {isVerified && (
                                    <span className="flex items-center gap-1 px-3 py-1 rounded-full"
                                        style={{
                                            background: 'var(--tertiary-container)',
                                            color: '#ffffff',
                                            fontSize: '0.625rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            lineHeight: 1
                                        }}>
                                        <BadgeCheck style={{ width: '0.75rem', height: '0.75rem' }} />
                                        Verified
                                    </span>
                                )}
                            </div>
                            <p className="mb-0 font-medium" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                {roleSubtitle}
                            </p>
                            {(profile.city || profile.state) && (
                                <p className="mb-0 text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                                    <MapPin className="mr-1 inline-block" style={{ width: '1rem', height: '1rem', verticalAlign: 'text-bottom' }} />
                                    {[profile.city, profile.state].filter(Boolean).join(', ')}
                                    {profile.dob ? ` • ${getAge(profile.dob)} yrs` : ''}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 items-center">
                        {isOwnProfile && (
                            <Link href="/profile/edit"
                                className="px-5 py-2 font-bold rounded-xl"
                                style={{
                                    background: 'linear-gradient(135deg, #0056b6 0%, #006ee5 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 20px 40px rgba(0,86,182,0.15)'
                                }}>
                                Edit Profile
                            </Link>
                        )}
                        <button
                            className="px-4 py-2 rounded-xl"
                            style={{
                                background: 'var(--surface-container-low)',
                                color: 'var(--text-main)',
                                border: 'none',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                            <Share2 className="mr-2 inline-block" style={{ width: '1rem', height: '1rem', verticalAlign: 'text-bottom' }} />Share
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
                <div className="p-4 rounded-3xl mb-5"
                    style={{ background: 'var(--surface-container-lowest)', border: 'none' }}>
                    <div className="flex justify-between items-end mb-3">
                        <span className="font-bold text-sm" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Profile Completion
                        </span>
                        <span className="font-extrabold" style={{ fontSize: '1.75rem', color: 'var(--primary-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                            {completionPercent}%
                        </span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden mb-3" style={{ height: '10px', background: 'var(--surface-container)' }}>
                        <div className="h-full rounded-full"
                            style={{
                                width: `${completionPercent}%`,
                                background: 'linear-gradient(135deg, #0056b6 0%, #006ee5 100%)',
                                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        />
                    </div>
                    <p className="text-sm mb-0 p-3 rounded-xl" style={{ background: 'rgba(0,86,182,0.06)', color: 'var(--text-muted)' }}>
                        <span className="font-bold" style={{ color: 'var(--primary-main)' }}>Pro Tip:</span>
                        {' '}Add your PAN Card to reach up to 100% and get priority job listings.
                    </p>
                </div>
            )}
        </>
    );
});

ProfileHeader.displayName = 'ProfileHeader';
export default ProfileHeader;
