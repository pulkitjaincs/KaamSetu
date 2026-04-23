import { useState, useCallback, memo } from 'react';
import { Contact, Mail, CheckCircle, Phone } from 'lucide-react';

const inputStyle = {
    background: 'var(--bg-body)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
};

const sectionStyle = {
    background: 'var(--bg-surface)', borderRadius: '16px', padding: '20px',
    border: '1px solid var(--border-color)'
};

const primaryBtnStyle = { flex: 1, background: 'var(--text-main)', color: 'var(--bg-body)', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 600, fontSize: '0.9rem' };
const cancelBtnStyle = { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 16px', fontWeight: 500, fontSize: '0.9rem' };
const verifyBtnStyle = { flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 600, fontSize: '0.9rem' };
const verifiedBadgeStyle = { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 };
const otpInputStyle = { ...inputStyle, marginBottom: '12px', textAlign: 'center' as const, letterSpacing: '4px', fontWeight: 700, fontSize: '1.2rem' };

interface ContactUser {
    email?: string;
    phone?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
}

interface ContactData {
    email: string;
    phone: string;
    otp: string;
    [key: string]: string;
}

type OTPPayload = { email: string } | { phone: string };
type VerifyPayload = { otp: string; email?: string; phone?: string };

const ContactDetailsCard = memo(({ user, onSendOTP, onVerifyOTP }: { user: ContactUser, onSendOTP: (payload: OTPPayload) => Promise<void>, onVerifyOTP: (payload: VerifyPayload) => Promise<void> }) => {
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [contactData, setContactData] = useState<ContactData>({ email: '', phone: '', otp: '' });
    const [contactLoading, setContactLoading] = useState(false);

    const startEditing = useCallback((field: string) => {
        setEditingSection(field);
        setOtpSent(false);
        setContactData({ email: '', phone: '', otp: '' });
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingSection(null);
        setOtpSent(false);
        setContactData({ email: '', phone: '', otp: '' });
    }, []);

    const handleContactChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactData((prev: ContactData) => ({ ...prev, [name]: value }));
    }, []);

    const handleSendOTP = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setContactLoading(true);
        try {
            const payload: OTPPayload = editingSection === 'email' ? { email: contactData.email } : { phone: contactData.phone };
            await onSendOTP(payload);
            setOtpSent(true);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            alert(axiosErr.response?.data?.error || "Failed to send OTP");
        } finally {
            setContactLoading(false);
        }
    }, [editingSection, contactData, onSendOTP]);

    const handleVerifyUpdate = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setContactLoading(true);
        try {
            const payload: VerifyPayload = {
                otp: contactData.otp,
                ...(editingSection === 'email' ? { email: contactData.email } : { phone: contactData.phone })
            };
            await onVerifyOTP(payload);
            cancelEditing();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            alert(axiosErr.response?.data?.error || "Failed to verify");
        } finally {
            setContactLoading(false);
        }
    }, [contactData, editingSection, onVerifyOTP, cancelEditing]);

    const renderEditForm = (type: string, placeholder: string, inputType = 'text') => (
        <form onSubmit={otpSent ? handleVerifyUpdate : handleSendOTP}>
            {!otpSent ? (
                <>
                    {type === 'phone' ? (
                        <div className="flex items-center gap-2 mb-3">
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>+91</span>
                            <input type="tel" name="phone" value={contactData.phone} onChange={handleContactChange} maxLength={10}
                                style={{ ...inputStyle, flex: 1 }} className="w-full" placeholder={placeholder} autoFocus required />
                        </div>
                    ) : (
                        <input type={inputType} name={type} value={contactData[type]} onChange={handleContactChange}
                            style={{ ...inputStyle, marginBottom: '12px' }} className="w-full" placeholder={placeholder} autoFocus required />
                    )}
                    <div className="flex gap-2">
                        <button type="submit" disabled={contactLoading} style={primaryBtnStyle}>Send OTP</button>
                        <button type="button" onClick={cancelEditing} style={cancelBtnStyle}>Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-sm mb-2" style={{ color: 'var(--primary-600)' }}>
                        OTP sent to {type === 'email' ? contactData.email : `+91 ${contactData.phone}`}
                    </p>
                    <input type="text" name="otp" value={contactData.otp} onChange={handleContactChange} maxLength={6}
                        style={otpInputStyle} className="w-full" placeholder="000000" autoFocus required />
                    <div className="flex gap-2">
                        <button type="submit" disabled={contactLoading} style={verifyBtnStyle}>Verify</button>
                        <button type="button" onClick={() => setOtpSent(false)} style={cancelBtnStyle}>Back</button>
                    </div>
                </>
            )}
        </form>
    );

    return (
        <div style={{ padding: '28px' }}>
            <div className="flex items-center gap-3 mb-4">
                <div style={{
                    width: '52px', height: '52px', borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Contact style={{ color: '#10b981', width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div>
                    <h5 className="font-bold mb-0" style={{ color: 'var(--text-main)' }}>Contact Details</h5>
                    <p className="mb-0 text-sm" style={{ color: 'var(--text-muted)' }}>Email &amp; Phone</p>
                </div>
            </div>

            {/* Email Section */}
            <div style={{ ...sectionStyle, marginBottom: '16px' }}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <Mail style={{ color: 'var(--text-muted)', width: '1.2rem', height: '1.2rem' }} />
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-muted)' }}>EMAIL</span>
                    </div>
                    {editingSection !== 'email' && (
                        <button onClick={() => startEditing('email')}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                            Edit
                        </button>
                    )}
                </div>
                {editingSection === 'email' ? renderEditForm('email', 'new@email.com', 'email') : (
                    <div className="flex items-center justify-between">
                        <span className="font-semibold" style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                            {user?.email || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not linked</span>}
                        </span>
                        {user?.emailVerified && (
                            <span style={verifiedBadgeStyle} className="flex items-center"><CheckCircle className="mr-1" style={{ width: '1rem', height: '1rem' }} />Verified</span>
                        )}
                    </div>
                )}
            </div>

            {/* Phone Section */}
            <div style={sectionStyle}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <Phone style={{ color: 'var(--text-muted)', width: '1.2rem', height: '1.2rem' }} />
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-muted)' }}>PHONE</span>
                    </div>
                    {editingSection !== 'phone' && (
                        <button onClick={() => startEditing('phone')}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                            Edit
                        </button>
                    )}
                </div>
                {editingSection === 'phone' ? renderEditForm('phone', '9876543210', 'tel') : (
                    <div className="flex items-center justify-between">
                        <span className="font-semibold" style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                            {user?.phone ? `+91 ${user.phone}` : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not linked</span>}
                        </span>
                        {user?.phoneVerified && (
                            <span style={verifiedBadgeStyle} className="flex items-center"><CheckCircle className="mr-1" style={{ width: '1rem', height: '1rem' }} />Verified</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});
ContactDetailsCard.displayName = 'ContactDetailsCard';

export default ContactDetailsCard;
