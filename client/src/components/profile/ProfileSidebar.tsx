import { memo } from 'react';
import { formatSalary } from '@/utils/index';
import { Profile } from '@/types';

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

const chipStyle = {
    background: 'var(--surface-container-low)',
    color: 'var(--text-main)',
    fontWeight: 500,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: 'none',
    fontSize: '0.875rem'
};

interface ProfileSidebarProps {
    profile: Profile;
    isEmployer: boolean;
    isOwnProfile: boolean;
}

const ProfileSidebar = memo(({ profile, isEmployer, isOwnProfile }: ProfileSidebarProps) => (
    <>
        {/* Contact Card */}
        <div className="card border-0 mb-4" style={cardStyle}>
            <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"
                    style={{ color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                    <i className="bi bi-person-lines-fill text-primary"></i> Contact
                </h5>
                <div className="d-flex flex-column gap-3">
                    {profile.phone && (
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center justify-content-center rounded-full flex-shrink-0"
                                style={iconContainerStyle}>
                                <i className="bi bi-telephone"></i>
                            </div>
                            <div>
                                <p className="mb-0 small text-muted">Phone</p>
                                <p className="mb-0 fw-bold" style={{ color: 'var(--text-main)' }}>+91 {profile.phone}</p>
                            </div>
                        </div>
                    )}
                    {profile.whatsapp && (
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center justify-content-center rounded-full flex-shrink-0"
                                style={{ width: '40px', height: '40px', background: 'rgba(37,211,102,0.1)', flexShrink: 0 }}>
                                <i className="bi bi-whatsapp" style={{ color: '#25d366' }}></i>
                            </div>
                            <div>
                                <p className="mb-0 small text-muted">WhatsApp</p>
                                <p className="mb-0 fw-bold" style={{ color: 'var(--text-main)' }}>+91 {profile.whatsapp}</p>
                            </div>
                        </div>
                    )}
                    {profile.email && (
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center justify-content-center rounded-full flex-shrink-0"
                                style={iconContainerStyle}>
                                <i className="bi bi-envelope"></i>
                            </div>
                            <div>
                                <p className="mb-0 small text-muted">Email</p>
                                <p className="mb-0 fw-bold" style={{ color: 'var(--text-main)' }}>{profile.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {!isEmployer && (
            <>
                {/* Expected Salary */}
                {(profile.expectedSalary?.min ?? 0) > 0 && (
                    <div className="card border-0 mb-4" style={cardStyle}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                <i className="bi bi-currency-rupee text-primary"></i> Expected Salary
                            </h5>
                            <div className="p-3 rounded-3xl" style={{ background: 'var(--surface-container-low)' }}>
                                <p className="mb-0 fw-extrabold"
                                    style={{ fontSize: '1.75rem', color: 'var(--primary-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                                    {formatSalary(profile.expectedSalary?.min ?? 0, profile.expectedSalary?.max, profile.expectedSalary?.type)}
                                </p>
                                <p className="mb-0 small fw-medium text-muted mt-1 text-uppercase" style={{ letterSpacing: '0.06em' }}>
                                    per {profile.expectedSalary?.type === 'monthly' ? 'month' : 'day'}
                                </p>
                            </div>
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
    { key: 'aadhaar', label: 'Aadhaar Card', icon: 'bi-credit-card-2-front' },
    { key: 'pan', label: 'PAN Card', icon: 'bi-card-text' },
    { key: 'license', label: 'Driving License', icon: 'bi-car-front' },
] as const;

const DocumentsCard = memo(({ profile, isOwnProfile }: { profile: Profile; isOwnProfile: boolean }) => (
    <div className="card border-0" style={cardStyle}>
        <div className="card-body p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
                <i className="bi bi-file-earmark-check text-primary"></i> Legal Documents
            </h5>
            <div className="d-flex flex-column gap-3">
                {DOCS.map(doc => {
                    const docData = profile.documents?.[doc.key as keyof typeof profile.documents];
                    const isVerified = docData?.verified;
                    const hasPending = !isVerified && docData?.number;
                    const needsAction = !isVerified && !hasPending && isOwnProfile;
                    const isError = needsAction && doc.key === 'license'; // example: license may be critical

                    return (
                        <div key={doc.key}
                            className="d-flex align-items-center justify-content-between p-3 rounded-3xl"
                            style={{
                                background: 'var(--surface-container-low)',
                                border: isError ? '2px dashed rgba(186,26,26,0.2)' : 'none'
                            }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded-xl d-flex align-items-center justify-content-center"
                                    style={{ background: 'var(--surface-container-lowest)' }}>
                                    <i className={`bi ${doc.icon} ${isError ? 'text-danger' : 'text-primary'}`}></i>
                                </div>
                                <span className="fw-semibold" style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>
                                    {doc.label}
                                </span>
                            </div>

                            {isVerified ? (
                                <span className="badge rounded-full px-3 py-1"
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
                                <span className="badge rounded-full px-3 py-1"
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
                                    className="badge rounded-full px-3 py-1"
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
    </div>
));

ProfileSidebar.displayName = 'ProfileSidebar';
DocumentsCard.displayName = 'DocumentsCard';

export { DocumentsCard };
export default ProfileSidebar;
