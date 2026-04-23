import { InputField, SelectField } from '@/components/common/FormComponents';
import { Camera, BadgeCheck, Settings, MessageCircle } from 'lucide-react';

interface BasicsFormData { name?: string; phone?: string; whatsapp?: string; designation?: string; isHiringManager?: boolean; isAvatarHidden?: boolean; gender?: string; dob?: string; }
interface BasicsUser { phone?: string; phoneVerified?: boolean; }
type HandleChange = (e: { target: { name: string; value: unknown; type?: string; checked?: boolean } }) => void;
export default function EditProfile_Basics({ formData, handleChange, user, isEmployer, avatar, uploadingAvatar, handleAvatarUpload, handleAvatarRemove, fileInputRef, navigate }: {
    formData: BasicsFormData; handleChange: HandleChange; user: BasicsUser | null; isEmployer: boolean;
    avatar: string | null; uploadingAvatar: boolean; handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAvatarRemove: () => void; fileInputRef: React.RefObject<HTMLInputElement | null>; navigate: (path: string) => void;
}) {
    return (
        <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--text-main)' }}>
                {isEmployer ? 'Your profile details' : "Let's start with basics"}
            </h4>

            <div className="mb-4 flex items-center gap-4">
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '88px', height: '88px', borderRadius: '50%',
                        background: avatar ? `url(${avatar}) center/cover` : 'linear-gradient(135deg, var(--primary-500), #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
                        border: '3px solid var(--bg-card)'
                    }}>
                        {!avatar && <span style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>{formData.name?.charAt(0)?.toUpperCase() || '?'}</span>}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} />
                </div>
                <div>
                    <p className="mb-2 font-semibold" style={{ color: 'var(--text-main)' }}>Profile Photo</p>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}
                        style={{
                            background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                            borderRadius: '12px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 500,
                            color: 'var(--text-main)', cursor: 'pointer'
                        }}>
                        {uploadingAvatar ? <><span className="inline-block w-4 h-4 border-2 rounded-full animate-spin mr-2" style={{ borderTopColor: 'transparent', borderColor: 'var(--text-main)' }}></span>Uploading...</> : <><Camera className="mr-2 inline-block" size={16} />Upload Photo</>}
                    </button>
                    {avatar && (
                        <button type="button" onClick={handleAvatarRemove} disabled={uploadingAvatar}
                            style={{
                                background: 'transparent', border: 'none', marginLeft: '12px',
                                fontSize: '0.85rem', fontWeight: 500, color: 'var(--danger)', cursor: 'pointer'
                            }}>
                            Remove Photo
                        </button>
                    )}
                </div>
                
                <div className="ml-auto pr-3">
                    <div className="flex items-center gap-2 m-0 p-0">
                        <label className="font-semibold m-0" htmlFor="isAvatarHidden" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>
                            Hide Photo
                        </label>
                        <input type="checkbox" role="switch" id="isAvatarHidden" 
                            name="isAvatarHidden"
                            checked={formData.isAvatarHidden || false}
                            onChange={(e) => handleChange({ target: { name: 'isAvatarHidden', value: e.target.checked } })}
                            style={{ cursor: 'pointer', width: '36px', height: '20px' }}
                        />
                    </div>
                </div>
            </div>

            <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
            />


            <div className="mb-4">
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    Phone Number
                    {user?.phoneVerified ? (
                        <span className="inline-flex items-center rounded-full ml-2" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 600 }}>
                            <BadgeCheck className="mr-1 inline-block" size={14} />Verified
                        </span>
                    ) : (
                        <button type="button" onClick={() => navigate('/profile/settings')}
                            className="ml-2" style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
                            Verify Now
                        </button>
                    )}
                </label>
                <div className="flex items-center gap-2">
                    <input type="tel" value={user?.phone || ''} readOnly
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', color: 'var(--text-main)', cursor: 'not-allowed' }}
                        className="w-full" placeholder="Not set" />
                    <button type="button" onClick={() => navigate('/profile/settings')}
                        style={{ borderRadius: '12px', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 500, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 16px', cursor: 'pointer' }}>
                        <Settings className="mr-1 inline-block" size={16} />Change
                    </button>
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Phone can only be changed via Account Settings with OTP verification</small>
            </div>

            {isEmployer ? (
                <>
                    <InputField
                        label="WhatsApp Number"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        type="tel"
                        maxLength={10}
                        icon={<MessageCircle size={16} />}
                        placeholder="10-digit number (optional)"
                    />

                    <InputField
                        label="Designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="e.g. HR Manager, Recruiter"
                    />


                    <div className="mb-4">
                        <div className="flex items-start gap-3" style={{ paddingLeft: '0' }}>
                            <input type="checkbox" id="isHiringManager"
                                checked={formData.isHiringManager}
                                onChange={(e) => handleChange({ target: { name: 'isHiringManager', value: e.target.checked } })}
                                style={{ width: '20px', height: '20px', marginRight: '12px', marginTop: '2px' }} />
                            <div>
                                <label className="font-semibold" htmlFor="isHiringManager" style={{ color: 'var(--text-main)' }}>
                                    I am a Hiring Manager
                                </label>
                                <p className="mb-0 text-sm" style={{ color: 'var(--text-muted)' }}>Check if you directly handle hiring decisions</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <SelectField
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                    { label: 'Other', value: 'other' }
                                ]}
                            />
                        </div>
                        <div>
                            <InputField
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <InputField
                        label="WhatsApp Number"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        type="tel"
                        maxLength={10}
                        icon={<MessageCircle size={16} />}
                        placeholder="10-digit number"
                    />
                </>
            )}
        </div>
    );
}
