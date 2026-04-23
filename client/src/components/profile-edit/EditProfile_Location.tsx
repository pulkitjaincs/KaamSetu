import { InputField } from '@/components/common/FormComponents';

import { ShieldCheck } from 'lucide-react';

interface LocationFormData { city?: string; state?: string; pincode?: string; }
export default function EditProfile_Location({ formData, handleChange, navigate }: { formData: LocationFormData; handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; navigate: (path: string) => void }) {
    return (
        <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--text-main)' }}>Where are you located?</h4>

            <div className="flex items-center justify-between mb-4 p-3"
                style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-3">
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div>
                        <p className="mb-0 font-semibold" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Contact Details</p>
                        <p className="mb-0 text-sm" style={{ color: 'var(--text-muted)' }}>Manage in Account Settings</p>
                    </div>
                </div>
                <button type="button" onClick={() => navigate('/profile/settings')}
                    className="font-semibold" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Manage
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" />
                </div>
                <div>
                    <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Maharashtra" />
                </div>
            </div>

            <div style={{ maxWidth: '50%' }}>
                <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} placeholder="e.g. 400001" />
            </div>
        </div>
    );
}
