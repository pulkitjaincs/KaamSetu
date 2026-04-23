"use client";

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from '@/hooks/ui/useLogin';
import BrandLogo from '@/components/common/BrandLogo';
import { Loader2, Phone, Mail, AlertCircle, Lock, ShieldCheck } from 'lucide-react';

function LoginPageContent() {
    const { user } = useAuth();
    const {
        loginMethod, setLoginMethod,
        emailMethod, setEmailMethod,
        otpSent,
        phone, setPhone,
        otp, setOtp,
        email, setEmail,
        password, setPassword,
        error, loading,
        isNewUser,
        name, setName,
        role, setRole,
        resetState, handleLogin, getButtonText, redirect, router
    } = useLogin();

    useEffect(() => {
        document.title = 'Login | SkillAnchor';
    }, []);

    useEffect(() => {
        if (user) {
            router.push(redirect);
            return;
        }
    }, [user, router, redirect]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-5 bg-[var(--bg-body)]">
            <div className="flex flex-wrap w-full justify-center">
                <div className="w-full sm:w-10/12 md:w-8/12 lg:w-5/12 xl:w-4/12">

                    <div className="bg-[var(--bg-card)] rounded-[24px] overflow-hidden border-0 shadow-lg">

                        <div className="text-center pt-12 pb-6 px-6 bg-gradient-to-br from-[var(--primary-100)] to-[var(--zinc-100)]">
                            <div className="inline-flex items-center justify-center mb-4 rounded-2xl w-16 h-16 bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-sm">
                                <BrandLogo className="w-20 h-20" iconSize={64} />
                            </div>
                            <h2 className="font-bold mb-1 text-zinc-900 tracking-tight text-2xl">Welcome Back</h2>
                            <p className="mb-0 text-zinc-600">Sign in to find your next opportunity</p>
                        </div>

                        <div className="p-6 md:p-12">

                            <div className="flex gap-2 mb-4 p-1 rounded-full bg-[var(--bg-surface)]">
                                <button type="button" onClick={() => { setLoginMethod('phone'); resetState(); }}
                                    className={`flex-1 rounded-full py-2 font-medium text-sm transition-all ${loginMethod === 'phone' ? 'bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                                    <Phone className="me-2 inline-block" size={16} />Phone
                                </button>
                                <button type="button" onClick={() => { setLoginMethod('email'); resetState(); }}
                                    className={`flex-1 rounded-full py-2 font-medium text-sm transition-all ${loginMethod === 'email' ? 'bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                                    <Mail className="me-2 inline-block" size={16} />Email
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl flex items-center gap-2 bg-red-500/10 border border-red-500/30">
                                    <AlertCircle className="text-red-500" size={16} />
                                    <span className="text-sm font-medium text-red-500">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                {loginMethod === 'phone' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Phone Number</label>
                                            <div className="auth-input-container group">
                                                <span className="flex items-center px-4 font-medium bg-[var(--bg-surface)] text-[var(--text-main)] border-r border-[var(--border-color)] transition-colors group-focus-within:border-[#6366f1] group-focus-within:border-r-1.5">+91</span>
                                                <input
                                                    type="tel"
                                                    className="auth-form-control"
                                                    placeholder="Enter your phone number"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    disabled={otpSent}
                                                />
                                            </div>
                                        </div>

                                        {otpSent && (
                                            <>
                                                {isNewUser && (
                                                    <>
                                                        <div className="mb-4">
                                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Full Name</label>
                                                            <div className="auth-input-container group">
                                                                <input
                                                                    type="text"
                                                                    className="auth-form-control"
                                                                    placeholder="John Doe"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">I am a</label>
                                                            <div className="auth-input-container group">
                                                                <select
                                                                    className="auth-form-control appearance-none"
                                                                    value={role}
                                                                    onChange={(e) => setRole(e.target.value as 'worker' | 'employer')}
                                                                >
                                                                    <option value="worker">Job Seeker (Worker)</option>
                                                                    <option value="employer">Employer / Recruiter</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="mb-4">
                                                    <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Enter OTP</label>
                                                    <div className="auth-input-container group">
                                                        <input
                                                            type="text"
                                                            className="auth-form-control text-lg tracking-[0.5em] text-center"
                                                            placeholder="6-digit OTP"
                                                            maxLength={6}
                                                            value={otp}
                                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                        />
                                                    </div>
                                                    <button type="button" className="p-0 mt-2 text-indigo-600 dark:text-indigo-400 text-sm bg-transparent border-none cursor-pointer" onClick={resetState}>Change number</button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}

                                {loginMethod === 'email' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Email Address</label>
                                            <div className="auth-input-container group">
                                                <input
                                                    type="email"
                                                    className="auth-form-control"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled={otpSent}
                                                />
                                            </div>
                                        </div>

                                        {!otpSent && (
                                            <div className="flex gap-2 mb-4">
                                                <button type="button" onClick={() => { setEmailMethod('password'); setOtp(''); }}
                                                    className={`flex-1 py-2 font-medium rounded-xl text-sm transition-all ${emailMethod === 'password' ? 'bg-indigo-600 text-white' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'}`}>
                                                    <Lock className="me-1 inline-block" size={16} />Password
                                                </button>
                                                <button type="button" onClick={() => { setEmailMethod('otp'); setPassword(''); }}
                                                    className={`flex-1 py-2 font-medium rounded-xl text-sm transition-all ${emailMethod === 'otp' ? 'bg-indigo-600 text-white' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'}`}>
                                                    <ShieldCheck className="me-1 inline-block" size={16} />OTP
                                                </button>
                                            </div>
                                        )}

                                        {emailMethod === 'password' && (
                                            <div className="mb-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block font-medium text-xs uppercase m-0 text-[var(--text-muted)] tracking-wider">Password</label>
                                                    <Link href="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Forgot?</Link>
                                                </div>
                                                <div className="auth-input-container group">
                                                    <input
                                                        type="password"
                                                        className="auth-form-control"
                                                        placeholder="Enter your password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {emailMethod === 'otp' && otpSent && (
                                            <>
                                                {isNewUser && (
                                                    <>
                                                        <div className="mb-4">
                                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Full Name</label>
                                                            <div className="auth-input-container group">
                                                                <input
                                                                    type="text"
                                                                    className="auth-form-control"
                                                                    placeholder="John Doe"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">I am a</label>
                                                            <div className="auth-input-container group">
                                                                <select
                                                                    className="auth-form-control appearance-none"
                                                                    value={role}
                                                                    onChange={(e) => setRole(e.target.value as 'worker' | 'employer')}
                                                                >
                                                                    <option value="worker">Job Seeker (Worker)</option>
                                                                    <option value="employer">Employer / Recruiter</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="mb-4">
                                                    <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Enter OTP</label>
                                                    <div className="auth-input-container group">
                                                        <input
                                                            type="text"
                                                            className="auth-form-control text-lg tracking-[0.5em] text-center"
                                                            placeholder="6-digit OTP"
                                                            maxLength={6}
                                                            value={otp}
                                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                        />
                                                    </div>
                                                    <button type="button" className="p-0 mt-2 text-indigo-600 dark:text-indigo-400 text-sm bg-transparent border-none cursor-pointer" onClick={resetState}>Change email</button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}

                                <button type="submit" className="w-full py-3 font-bold rounded-full bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-lg hover:opacity-85 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                                    {loading ? 'Please wait...' : getButtonText()}
                                </button>
                            </form>

                            <div className="flex items-center my-6">
                                <hr className="flex-1 border-t border-[var(--border-color)]" />
                                <span className="px-3 text-sm text-[var(--text-muted)]">or</span>
                                <hr className="flex-1 border-t border-[var(--border-color)]" />
                            </div>

                            <p className="text-center mb-0 text-[var(--text-muted)]">
                                New to SkillAnchor?{' '}
                                <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Create an account</Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center mt-4 text-sm text-[var(--text-muted)]">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
            <LoginPageContent />
        </Suspense>
    );
}
