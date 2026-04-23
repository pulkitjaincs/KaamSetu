import { useState, useCallback, memo } from 'react';

const inputStyle = {
    background: 'var(--bg-body)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
};

const submitBtnBase = {
    width: '100%', border: 'none', borderRadius: '14px', padding: '14px',
    fontWeight: 600, fontSize: '0.95rem', transition: 'background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease'
};

import { ShieldCheck } from 'lucide-react';

const PasswordCard = memo(({ onSubmit }: { onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void> }) => {
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passLoading, setPassLoading] = useState(false);

    const handlePassChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleUpdatePassword = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmPassword) return alert("Passwords don't match!");
        setPassLoading(true);
        try {
            await onSubmit({ currentPassword: passData.currentPassword, newPassword: passData.newPassword });
            setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } finally {
            setPassLoading(false);
        }
    }, [passData, onSubmit]);

    return (
        <div style={{ padding: '28px' }}>
            <div className="flex items-center gap-3 mb-4">
                <div style={{
                    width: '52px', height: '52px', borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <ShieldCheck style={{ color: 'var(--primary-600)', width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div>
                    <h5 className="font-bold mb-0" style={{ color: 'var(--text-main)' }}>Password</h5>
                    <p className="mb-0 text-sm" style={{ color: 'var(--text-muted)' }}>Keep your account secure</p>
                </div>
            </div>

            <form onSubmit={handleUpdatePassword}>
                <div className="mb-3">
                    <label className="block font-semibold text-sm mb-1" style={{ color: 'var(--text-main)' }}>Current Password</label>
                    <input type="password" name="currentPassword" value={passData.currentPassword} onChange={handlePassChange}
                        style={inputStyle} className="w-full" placeholder="••••••••" required />
                </div>
                <div className="mb-3">
                    <label className="block font-semibold text-sm mb-1" style={{ color: 'var(--text-main)' }}>New Password</label>
                    <input type="password" name="newPassword" value={passData.newPassword} onChange={handlePassChange}
                        style={inputStyle} className="w-full" placeholder="Min 8 characters" required minLength={8} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold text-sm mb-1" style={{ color: 'var(--text-main)' }}>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={passData.confirmPassword} onChange={handlePassChange}
                        style={inputStyle} className="w-full" placeholder="Retype password" required minLength={8} />
                </div>
                <button type="submit" disabled={passLoading}
                    style={{ ...submitBtnBase, background: 'var(--text-main)', color: 'var(--bg-body)', cursor: passLoading ? 'not-allowed' : 'pointer' }}>
                    {passLoading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
});
PasswordCard.displayName = 'PasswordCard';

export default PasswordCard;
