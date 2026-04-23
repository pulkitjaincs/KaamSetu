"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import BrandLogo from '@/components/common/BrandLogo';
import { useEffect } from 'react';
import { Smartphone, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [method, setMethod] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        document.title = 'Reset Password | SkillAnchor';
    }, []);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (method === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address');
                return;
            }
        } else {
            if (phone.length !== 10) {
                setError('Please enter a valid 10-digit phone number');
                return;
            }
        }

        setLoading(true);
        try {
            const payload = method === 'email' ? { email } : { phone };
            await authAPI.forgotPassword(payload);
            setSuccess('OTP sent!');
            setStep(2);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const payload = method === 'email'
                ? { email, otp, newPassword }
                : { phone, otp, newPassword };
            await authAPI.resetPassword(payload);
            setSuccess('Password reset successfully!');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex-1 flex items-center justify-center px-4 py-5 bg-[var(--bg-body)]">
            <div className="flex flex-wrap w-full justify-center">
                <div className="w-full sm:w-10/12 md:w-8/12 lg:w-5/12 xl:w-4/12">

                    <div className="bg-[var(--bg-card)] rounded-[24px] overflow-hidden border-0 shadow-lg">

                        <div className="text-center pt-12 pb-6 px-6 bg-gradient-to-br from-[var(--primary-100)] to-[var(--zinc-100)]">
                            <div className="inline-flex items-center justify-center mb-4 rounded-2xl bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] w-16 h-16 shadow-sm">
                                <BrandLogo className="w-20 h-20" iconSize={64} />
                            </div>
                            <h2 className="font-bold mb-1 text-zinc-900 tracking-tight text-2xl">
                                {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                            </h2>
                            <p className="mb-0 text-zinc-600">
                                {step === 1 ? "We'll send you an OTP to reset it" : 'Enter OTP and your new password'}
                            </p>
                        </div>

                        <div className="p-6 md:p-12">

                            {step === 1 && (
                                <div className="flex gap-2 mb-4 p-1 rounded-full bg-[var(--bg-surface)]">
                                    <button type="button" onClick={() => setMethod('phone')}
                                        className={`flex-1 rounded-full py-2 font-medium text-sm flex justify-center items-center transition-all ${method === 'phone' ? 'bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                                        <Smartphone className="w-4 h-4 mr-2" />Phone
                                    </button>
                                    <button type="button" onClick={() => setMethod('email')}
                                        className={`flex-1 rounded-full py-2 font-medium text-sm flex justify-center items-center transition-all ${method === 'email' ? 'bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                                        <Mail className="w-4 h-4 mr-2" />Email
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 rounded-xl flex items-center gap-2 bg-red-500/10 border border-red-500/30">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <span className="text-sm font-medium text-red-500">{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 rounded-xl flex items-center gap-2 bg-green-500/10 border border-green-500/30">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm font-medium text-green-500">{success}</span>
                                </div>
                            )}

                            {step === 1 ? (
                                <form onSubmit={handleSendOtp}>
                                    {method === 'email' ? (
                                        <div className="mb-4">
                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Email Address</label>
                                            <div className="auth-input-container group">
                                                <input
                                                    type="email"
                                                    className="auth-form-control"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-4">
                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Phone Number</label>
                                            <div className="auth-input-container group">
                                                <span className="flex items-center px-4 font-medium bg-[var(--bg-surface)] text-[var(--text-muted)] border-r border-[var(--border-color)] transition-colors group-focus-within:border-[#6366f1] group-focus-within:border-r-1.5">+91</span>
                                                <input
                                                    type="tel"
                                                    className="auth-form-control"
                                                    placeholder="Enter your phone number"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button type="submit" className="w-full py-3 font-bold rounded-full shadow-lg bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                                        {loading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword}>
                                    <div className="mb-4 p-3 rounded-xl flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-color)]">
                                        <strong className="text-[var(--text-main)]">{method === 'email' ? email : `+91 ${phone}`}</strong>
                                        <button type="button" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer bg-transparent border-none p-0" onClick={() => { setStep(1); setSuccess(''); setError(''); }}>
                                            Change
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Enter OTP</label>
                                        <div className="auth-input-container">
                                            <input
                                                type="text"
                                                className="auth-form-control text-lg tracking-[0.5em] text-center"
                                                placeholder="6-digit OTP"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">New Password</label>
                                        <div className="auth-input-container">
                                            <input
                                                type="password"
                                                className="auth-form-control"
                                                placeholder="At least 8 characters"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Confirm Password</label>
                                        <div className="auth-input-container">
                                            <input
                                                type="password"
                                                className="auth-form-control"
                                                placeholder="Re-enter password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full py-3 font-bold rounded-full shadow-lg bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed mt-6" disabled={loading}>
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            )}

                            <div className="flex items-center my-6">
                                <hr className="flex-1 border-t border-[var(--border-color)]" />
                                <span className="px-3 text-sm text-[var(--text-muted)]">or</span>
                                <hr className="flex-1 border-t border-[var(--border-color)]" />
                            </div>

                            <p className="text-center mb-0 text-[var(--text-muted)]">
                                Remember your password?{' '}
                                <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</Link>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
