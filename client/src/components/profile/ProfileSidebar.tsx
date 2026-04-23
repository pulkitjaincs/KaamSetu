import { memo } from 'react';
import { formatSalary } from '@/utils/index';
import { Profile } from '@/types';
import { Contact, Phone, MessageCircle, Mail, IndianRupee, CreditCard, IdCard, Car, FileCheck } from 'lucide-react';

const cardStyle = {
    borderRadius: '24px',
    background: 'var(--surface-container-lowest)'
};

const iconContainerStyle = {
    width: '40px',
    height: '40px',
    background: 'var(--surface-container-low)',
    color: 'var(--primary-main)',
    flexShrink: 0 as const
};



interface ProfileSidebarProps {
    profile: Profile;
    isEmployer: boolean;
    isOwnProfile: boolean;
}

const ProfileSidebar = memo(({ profile, isEmployer, isOwnProfile }: ProfileSidebarProps) => (
    <>
        {/* Contact Card */}
        <div className="border-0 mb-4 p-4 rounded-3xl" style={cardStyle}>
                <h5 className="font-bold mb-4 flex items-center gap-2"
                    style={{ color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                    <Contact style={{ color: 'var(--primary-main)' }} /> Contact
                </h5>
                <div className="flex flex-col gap-3">
                    {profile.phone && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center rounded-full shrink-0"
                                style={iconContainerStyle}>
                                <Phone />
                            </div>
                            <div>
                                <p className="mb-0 text-sm text-[var(--text-muted)]">Phone</p>
                                <p className="mb-0 font-bold" style={{ color: 'var(--text-main)' }}>+91 {profile.phone}</p>
                            </div>
                        </div>
                    )}
                    {profile.whatsapp && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center rounded-full shrink-0"
                                style={{ width: '40px', height: '40px', background: 'rgba(37,211,102,0.1)', flexShrink: 0 }}>
                                <MessageCircle style={{ color: '#25d366' }} />
                            </div>
                            <div>
                                <p className="mb-0 text-sm text-[var(--text-muted)]">WhatsApp</p>
                                <p className="mb-0 font-bold" style={{ color: 'var(--text-main)' }}>+91 {profile.whatsapp}</p>
                            </div>
                        </div>
                    )}
                    {profile.email && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center rounded-full shrink-0"
                                style={iconContainerStyle}>
                                <Mail />
                            </div>
                            <div>
                                <p className="mb-0 text-sm text-[var(--text-muted)]">Email</p>
                                <p className="mb-0 font-bold" style={{ color: 'var(--text-main)' }}>{profile.email}</p>
                            </div>
                        </div>
                    )}
                </div>
        </div>

        {!isEmployer && (
            <>
                {/* Expected Salary */}
                {(profile.expectedSalary?.min ?? 0) > 0 && (
                    <div className="border-0 mb-4 p-4 rounded-3xl" style={cardStyle}>
                            <h5 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                <IndianRupee style={{ color: 'var(--primary-main)' }} /> Expected Salary
                            </h5>
                            <div className="p-3 rounded-3xl" style={{ background: 'var(--surface-container-low)' }}>
                                <p className="mb-0 font-extrabold"
                                    style={{ fontSize: '1.75rem', color: 'var(--primary-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                                    {formatSalary(profile.expectedSalary?.min ?? 0, profile.expectedSalary?.max, profile.expectedSalary?.type)}
                                </p>
                                <p className="mb-0 text-sm font-medium text-[var(--text-muted)] mt-1 uppercase" style={{ letterSpacing: '0.06em' }}>
                                    per {profile.expectedSalary?.type === 'monthly' ? 'month' : 'day'}
                                </p>
                            </div>
                    </div>
                )}

                {/* Legal Documents */}
                <DocumentsCard profile={profile} isOwnProfile={isOwnProfile} />
            </>
        )}
    </>
));

const DOCS = [
    { key: 'aadhaar', label: 'Aadhaar Card', icon: CreditCard },
    { key: 'pan', label: 'PAN Card', icon: IdCard },
    { key: 'license', label: 'Driving License', icon: Car },
] as const;

const DocumentsCard = memo(({ profile, isOwnProfile }: { profile: Profile; isOwnProfile: boolean }) => (
    <div className="border-0 p-4 rounded-3xl" style={cardStyle}>
        <h5 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <FileCheck style={{ color: 'var(--primary-main)' }} /> Legal Documents
        </h5>
        <div className="flex flex-col gap-3">
            {DOCS.map(doc => {
                const docData = profile.documents?.[doc.key as keyof typeof profile.documents];
                const isVerified = docData?.verified;
                const hasPending = !isVerified && docData?.number;
                const needsAction = !isVerified && !hasPending && isOwnProfile;
                const isError = needsAction && doc.key === 'license';

                return (
                    <div key={doc.key}
                        className="flex items-center justify-between p-3 rounded-3xl"
                        style={{
                            background: 'var(--surface-container-low)',
                            border: isError ? '2px dashed rgba(186,26,26,0.2)' : 'none'
                        }}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl flex items-center justify-center"
                                style={{ background: 'var(--surface-container-lowest)' }}>
                                {(() => {
                                    const Icon = doc.icon;
                                    return <Icon className={isError ? 'text-red-600' : ''} style={isError ? {} : { color: 'var(--primary-main)' }} />;
                                })()}
                            </div>
                            <span className="font-semibold" style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>
                                {doc.label}
                            </span>
                        </div>

                        {isVerified ? (
                            <span className="rounded-full px-3 py-1"
                                style={{
                                    background: 'rgba(0,100,102,0.1)',
                                    color: 'var(--tertiary)',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase'
                                }}>
                                Verified
                            </span>
                        ) : hasPending ? (
                            <span className="rounded-full px-3 py-1"
                                style={{
                                    background: 'var(--surface-container-highest)',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase'
                                }}>
                                Pending
                            </span>
                        ) : isOwnProfile ? (
                            <button
                                className="rounded-full px-3 py-1"
                                style={{
                                    background: 'rgba(186,26,26,0.1)',
                                    color: '#ba1a1a',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}>
                                Action Required
                            </button>
                        ) : null}
                    </div>
                );
            })}
        </div>
    </div>
));

ProfileSidebar.displayName = 'ProfileSidebar';
DocumentsCard.displayName = 'DocumentsCard';

export { DocumentsCard };
export default ProfileSidebar;
