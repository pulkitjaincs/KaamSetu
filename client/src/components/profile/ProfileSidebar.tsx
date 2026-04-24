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

import CollapsibleSection from '../common/CollapsibleSection';

const ProfileSidebar = memo(({ profile, isEmployer, isOwnProfile }: ProfileSidebarProps) => (
    <>
        {/* Contact Card */}
        <CollapsibleSection 
            title="Contact Details" 
            icon={<Contact size={20} />}
        >
            <div className="border-0 mb-4 p-4 rounded-3xl" style={cardStyle}>
                    <h5 className="font-bold mb-4 lg:flex hidden items-center gap-2"
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
        </CollapsibleSection>

        {!isEmployer && (
            <>
                {/* Expected Salary - Premium redesigned card */}
                {(profile.expectedSalary?.min ?? 0) > 0 && (
                    <div className="mb-6 p-5 lg:p-6 rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm overflow-hidden relative group">
                        {/* Interactive glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-main)] to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--primary-main)] opacity-[0.03] rounded-full blur-2xl" />
                        
                        <div className="relative flex lg:flex-col items-center lg:items-start justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-[var(--primary-container)] text-[var(--primary-main)] shadow-inner">
                                    <IndianRupee size={22} />
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="font-bold mb-0 text-[var(--text-main)] text-sm lg:text-base tracking-tight opacity-90">
                                        Expected Salary
                                    </h5>
                                    <p className="mb-0 text-[10px] lg:hidden font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                                        per {profile.expectedSalary?.type === 'monthly' ? 'month' : 'day'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end lg:items-start lg:mt-2">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="font-black text-2xl lg:text-4xl text-[var(--primary-main)] tracking-tighter leading-none">
                                        {formatSalary(profile.expectedSalary?.min ?? 0, profile.expectedSalary?.max, profile.expectedSalary?.type)}
                                    </span>
                                </div>
                                <p className="mb-0 hidden lg:block text-xs font-bold text-[var(--text-muted)] mt-2 uppercase tracking-widest opacity-70">
                                    per {profile.expectedSalary?.type === 'monthly' ? 'month' : 'day'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Legal Documents */}
                <CollapsibleSection title="Documents" icon={<FileCheck size={20} />}>
                    <DocumentsCard profile={profile} isOwnProfile={isOwnProfile} />
                </CollapsibleSection>
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
        <h5 className="font-bold mb-4 lg:flex hidden items-center gap-2" style={{ color: 'var(--text-main)' }}>
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
