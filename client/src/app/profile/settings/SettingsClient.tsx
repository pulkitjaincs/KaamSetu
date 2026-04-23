"use client";

import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Settings } from 'lucide-react';
import { authAPI } from '@/lib/api';
import PasswordCard from '@/components/settings/PasswordCard';
import ContactDetailsCard from '@/components/settings/ContactDetailsCard';

const cardStyle = {
    background: 'var(--bg-card)',
    borderRadius: '24px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
    overflow: 'hidden'
};

export default function SettingsClient() {
    const { user, updateUserData } = useAuth();

    const handlePasswordSubmit = useCallback(async (data: { currentPassword: string; newPassword: string }) => {
        try {
            await authAPI.updatePassword(data);
            alert("Password updated!");
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            alert(axiosErr.response?.data?.error || "Failed to update");
            throw err;
        }
    }, []);
    const handleSendOTP = useCallback(async (payload: { email: string } | { phone: string }) => {
        const withAuthType = 'email' in payload
            ? { authType: 'email' as const, ...payload }
            : { authType: 'phone' as const, ...payload };
        await authAPI.sendUpdateOTP(withAuthType);
    }, []);

    const handleVerifyOTP = useCallback(async (payload: { otp: string; email?: string; phone?: string }) => {
        const authType = payload.email ? 'email' as const : 'phone' as const;
        const { data } = await authAPI.verifyUpdateOTP({ authType, ...payload });
        if (data.user) updateUserData(data.user);
    }, [updateUserData]);

    return (
        <div style={{ minHeight: '100vh', padding: '60px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Header */}
                <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center mb-4"
                        style={{
                            width: '80px', height: '80px', borderRadius: '24px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            boxShadow: '0 16px 48px rgba(59, 130, 246, 0.3)'
                        }}>
                        <Settings className="text-white" size={32} />
                    </div>
                    <h1 className="font-bold mb-2" style={{ fontSize: '2.25rem', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                        Account Settings
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '400px', margin: '0 auto' }}>
                        Manage your security and contact preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <div style={cardStyle}>
                            <PasswordCard onSubmit={handlePasswordSubmit} />
                        </div>
                    </div>
                    <div>
                        <div style={cardStyle}>
                            <ContactDetailsCard
                                user={user ?? {} as Parameters<typeof ContactDetailsCard>[0]['user']}
                                onSendOTP={handleSendOTP}
                                onVerifyOTP={handleVerifyOTP}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
