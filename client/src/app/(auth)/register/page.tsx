"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRegister } from '@/hooks/ui/useRegister';
import BrandLogo from '@/components/common/BrandLogo';
import { Phone, Mail, AlertCircle, Contact, Building } from 'lucide-react';

export default function RegisterPage() {
    const { user } = useAuth();
    const router = useRouter();

    const {
        role, setRole,
        registerMethod, setRegisterMethod,
        otpSent, setOtpSent,
        name, setName,
        phone, setPhone,
        otp, setOtp,
        email, setEmail,
        password, setPassword,
        error, loading,
        handleRegister
    } = useRegister();

    useEffect(() => {
        document.title = 'Create Account | SkillAnchor';
    }, []);

    useEffect(() => {
        if (user) {
            router.push('/');
            return;
        }
    }, [user, router]);

    return (
        <div className="min-h-screen flex-1 flex items-center justify-center px-4 py-5 bg-[var(--bg-body)]">
            <div className="flex flex-wrap w-full justify-center">
                <div className="w-full sm:w-10/12 md:w-8/12 lg:w-5/12 xl:w-4/12">

                    <div className="bg-[var(--bg-card)] rounded-[24px] overflow-hidden border-0 shadow-lg">

                        <div className="text-center pt-12 pb-6 px-6 bg-gradient-to-br from-[var(--primary-100)] to-[var(--zinc-100)]">
                            <div className="inline-flex items-center justify-center mb-4 rounded-2xl w-16 h-16 bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-sm">
                                <BrandLogo className="w-20 h-20" iconSize={64} />
                            </div>
                            <h2 className="font-bold mb-1 text-zinc-900 tracking-tight text-2xl">Join SkillAnchor</h2>
                            <p className="mb-0 text-zinc-600">Create your account to get started</p>
                        </div>

                        <div className="p-6 md:p-12">

                            <div className="mb-4">
                                <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">I am a</label>
                                <div className="flex gap-3">
                                    <div onClick={() => setRole('worker')}
                                        className={`flex-1 p-3 rounded-3xl text-center cursor-pointer transition-all border-2 ${role === 'worker' ? 'bg-[var(--primary-100)] border-[var(--primary-600)] dark:bg-black dark:border-[var(--primary-500)]' : 'bg-[var(--bg-surface)] border-transparent'}`}>
                                        <Contact className={`block mb-2 mx-auto transition-colors ${role === 'worker' ? 'text-[var(--primary-600)]' : 'text-[var(--text-muted)]'}`} size={32} />
                                        <span className={`font-semibold transition-colors ${role === 'worker' ? 'text-[var(--primary-700)] dark:text-[var(--primary-300)]' : 'text-[var(--text-muted)]'}`}>Job Seeker</span>
                                    </div>
                                    <div onClick={() => setRole('employer')}
                                        className={`flex-1 p-3 rounded-3xl text-center cursor-pointer transition-all border-2 ${role === 'employer' ? 'bg-[var(--primary-100)] border-[var(--primary-600)] dark:bg-black dark:border-[var(--primary-500)]' : 'bg-[var(--bg-surface)] border-transparent'}`}>
                                        <Building className={`block mb-2 mx-auto transition-colors ${role === 'employer' ? 'text-[var(--primary-600)]' : 'text-[var(--text-muted)]'}`} size={32} />
                                        <span className={`font-semibold transition-colors ${role === 'employer' ? 'text-[var(--primary-700)] dark:text-[var(--primary-300)]' : 'text-[var(--text-muted)]'}`}>Employer</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-4 p-1 rounded-full bg-[var(--bg-surface)]">
                                <button type="button" onClick={() => setRegisterMethod('phone')}
                                    className={`flex-1 rounded-full py-2 font-medium text-sm transition-all ${registerMethod === 'phone' ? 'bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                                    <Phone className="me-2 inline-block" size={16} />Phone
                                </button>
                                <button type="button" onClick={() => setRegisterMethod('email')}
                                    className={`flex-1 rounded-full py-2 font-medium text-sm transition-all ${registerMethod === 'email' ? 'bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                                    <Mail className="me-2 inline-block" size={16} />Email
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl flex items-center gap-2 bg-red-500/10 border border-red-500/30">
                                    <AlertCircle className="text-red-500" size={16} />
                                    <span className="text-sm font-medium text-red-500">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleRegister}>
                                <div className="mb-4">
                                    <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Full Name</label>
                                    <div className="auth-input-container group">
                                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="auth-form-control" placeholder="Enter your full name" />
                                    </div>
                                </div>

                                {registerMethod === 'phone' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Phone Number</label>
                                            <div className="auth-input-container group">
                                                <span className="flex items-center px-4 font-medium bg-[var(--bg-surface)] text-[var(--text-main)] border-r border-[var(--border-color)] transition-colors group-focus-within:border-[#6366f1] group-focus-within:border-r-1.5">+91</span>
                                                <input type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} disabled={otpSent} className="auth-form-control" placeholder="Enter your phone number" />
                                            </div>
                                        </div>

                                        {otpSent && (
                                            <div className="mb-4">
                                                <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Enter OTP</label>
                                                <div className="auth-input-container group">
                                                    <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="auth-form-control text-lg tracking-[0.5em] text-center" placeholder="6-digit OTP" maxLength={6} />
                                                </div>
                                                <button type="button" className="p-0 mt-2 text-indigo-600 dark:text-indigo-400 text-sm bg-transparent border-none cursor-pointer" onClick={() => setOtpSent(false)}>Change number</button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {registerMethod === 'email' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Email Address</label>
                                            <div className="auth-input-container group">
                                                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-form-control" placeholder="you@example.com" />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block font-medium text-xs uppercase mb-2 text-[var(--text-muted)] tracking-wider">Password</label>
                                            <div className="auth-input-container group">
                                                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-form-control" placeholder="Create a password" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button type="submit" className="w-full py-3 font-bold rounded-full bg-[var(--zinc-900)] dark:bg-[var(--zinc-50)] text-[var(--bg-card)] shadow-lg hover:opacity-85 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                                    {loading ? 'Please wait...' : (registerMethod === 'phone' ? (otpSent ? 'Verify & Register' : 'Send OTP') : 'Create Account')}
                                </button>
                            </form>

                            <div className="flex items-center my-6">
                                <hr className="flex-1 border-t border-[var(--border-color)]" />
                                <span className="px-3 text-sm text-[var(--text-muted)]">or</span>
                                <hr className="flex-1 border-t border-[var(--border-color)]" />
                            </div>

                            <p className="text-center mb-0 text-[var(--text-muted)]">
                                Already have an account?{' '}
                                <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center mt-4 text-sm text-gray-500">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div >
    );
}
