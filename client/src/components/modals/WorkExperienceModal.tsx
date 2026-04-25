"use client";

import { useState, useEffect } from 'react';
import { workExperienceAPI } from '@/lib/api';
import { InputField, TextAreaField } from '@/components/common/FormComponents';
import { Eye, EyeOff, BadgeCheck, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface WorkExperience {
    _id: string;
    role?: string;
    companyName?: string;
    company?: { name: string };
    startDate?: string;
    endDate?: string | null;
    isCurrent?: boolean;
    description?: string;
    isVerified?: boolean;
    isVisible?: boolean;
}

interface WorkExperienceModalProps {
    show: boolean;
    onClose: () => void;
    experience?: WorkExperience | null;
    onSave?: () => void;
}

export default function WorkExperienceModal({ show, onClose, experience, onSave }: WorkExperienceModalProps) {
    const isAddMode = !experience;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const [formData, setFormData] = useState({
        role: '',
        companyName: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!show) return;

        // Lock background scroll
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;
        
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
        };
    }, [show]);

    useEffect(() => {
        if (experience) {
            setFormData({
                role: experience.role || '',
                companyName: experience.companyName || experience.company?.name || '',
                startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
                endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
                isCurrent: experience.isCurrent || !experience.endDate,
                description: experience.description || ''
            });
        } else {
            setFormData({ role: '', companyName: '', startDate: '', endDate: '', isCurrent: false, description: '' });
        }
        setError('');
    }, [experience, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const type = (e.target as HTMLInputElement).type;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async () => {
        if (!formData.role || !formData.startDate) {
            setError('Role and Start Date are required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            if (isAddMode) {
                await workExperienceAPI.create({
                    ...formData,
                    endDate: formData.isCurrent ? undefined : formData.endDate
                });
            } else {
                await workExperienceAPI.update(experience._id, {
                    ...formData,
                    endDate: formData.isCurrent ? undefined : formData.endDate
                });
            }
            onSave?.();
            onClose();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message || 'Failed to save experience');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;
        setLoading(true);
        try {
            await workExperienceAPI.delete(experience!._id);
            onSave?.();
            onClose();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message || 'Failed to delete');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVisibility = async () => {
        setLoading(true);
        try {
            await workExperienceAPI.toggleVisibility(experience!._id);
            onSave?.();
            onClose();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message || 'Failed to update visibility');
        } finally {
            setLoading(false);
        }
    };

    const handleEndEmployment = async () => {
        if (!window.confirm('Are you sure you want to end this employment? This will update your job application status.')) return;
        setLoading(true);
        try {
            await workExperienceAPI.endEmployment(experience!._id);
            onSave?.();
            onClose();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message || 'Failed to end employment');
        } finally {
            setLoading(false);
        }
    };

    const isVerified = experience?.isVerified;
    const canEdit = !isVerified;
    const canEndEmployment = isVerified && experience?.isCurrent;

    const variants: Variants = {
        hidden: isMobile 
            ? { y: "100%", opacity: 1 } 
            : { opacity: 0, scale: 0.95, y: 20 },
        enter: {
            opacity: 1, y: 0, scale: 1,
            transition: isMobile ? { 
                duration: 0.35,
                ease: "linear"
            } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
        },
        exit: {
            opacity: isMobile ? 1 : 0,
            y: isMobile ? "100%" : 20,
            scale: isMobile ? 1 : 0.95,
            transition: isMobile ? { 
                duration: 0.3,
                ease: "linear"
            } : { duration: 0.15, ease: "easeIn" }
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center overflow-hidden">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div 
                        key="work-exp-modal"
                        initial="hidden"
                        animate="enter"
                        exit="exit"
                        variants={variants}
                        className={`relative flex flex-col z-10 bg-[var(--bg-card)] pointer-events-auto ${
                            isMobile 
                            ? 'w-full h-auto max-h-[85vh] rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]' 
                            : 'w-[90%] max-w-[550px] max-h-[90vh] rounded-[24px] shadow-2xl border border-[var(--border-color)]'
                        }`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Mobile Drag Handle */}
                        {isMobile && <div className="w-12 h-1.5 rounded-full bg-[var(--border-color)] opacity-30 mx-auto mt-4 mb-2 shrink-0" />}

                        {/* Sticky Header */}
                        <div className={`px-6 py-4 flex justify-between items-center border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0 ${!isMobile ? 'rounded-t-[24px]' : 'rounded-t-[32px]'}`}>
                            <h5 className="font-black text-[var(--text-main)] text-xl tracking-tight leading-none mb-0">
                                {isAddMode ? 'Add Work Experience' : (canEdit ? 'Edit Experience' : 'Experience Details')}
                            </h5>
                            {!isMobile && (
                                <button 
                                    type="button" 
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] transition-all hover:bg-[var(--border-color)]/20 hover:scale-110 active:scale-95"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Scrollable Body */}
                        <div className="grow overflow-y-auto custom-scroll" style={{ overscrollBehavior: 'contain' }}>
                            <div className="px-6 py-8">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 mb-8 rounded-2xl border border-red-100 bg-red-50/50 text-red-600 text-sm font-semibold flex items-center gap-3"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        {error}
                                    </motion.div>
                                )}

                                {/* Visibility Toggle - Status Card */}
                                {!isAddMode && (
                                    <div className="group relative p-5 mb-6 rounded-[24px] bg-[var(--bg-surface)] border border-[var(--border-color)] transition-all hover:border-[var(--primary-main)]/30 overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            {experience.isVisible !== false ? <Eye size={64} /> : <EyeOff size={64} />}
                                        </div>
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${experience.isVisible !== false ? 'bg-green-500' : 'bg-[var(--text-muted)]'}`} />
                                                    <span className="font-black text-[0.7rem] uppercase tracking-[0.15em] text-[var(--text-main)] opacity-50">Profile Status</span>
                                                </div>
                                                <h6 className="font-bold text-[var(--text-main)] mb-0">
                                                    {experience.isVisible !== false ? 'Visible to Employers' : 'Hidden from Profile'}
                                                </h6>
                                            </div>
                                            <button
                                                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                                                    experience.isVisible !== false 
                                                    ? 'bg-transparent text-[var(--text-main)] border-[var(--border-color)] hover:bg-[var(--border-color)]/50' 
                                                    : 'bg-[var(--primary-main)] text-white border-transparent shadow-lg shadow-[var(--primary-main)]/20 hover:scale-105 active:scale-95'
                                                }`}
                                                onClick={handleToggleVisibility}
                                                disabled={loading}
                                            >
                                                {experience.isVisible !== false ? 'Set Private' : 'Make Public'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Verified Experience - Status Card */}
                                {isVerified && (
                                    <div className="p-5 mb-6 rounded-[24px] bg-gradient-to-br from-[#10b981]/10 to-transparent border border-[#10b981]/20 relative overflow-hidden group">
                                        <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform">
                                            <BadgeCheck size={80} className="text-[#10b981]" />
                                        </div>
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#10b981]/20 flex items-center justify-center shadow-sm border border-[#10b981]/20">
                                                    <BadgeCheck className="text-[#10b981]" size={24} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-[0.6rem] uppercase tracking-[0.2em] text-[#10b981] opacity-70">Authenticated Record</span>
                                                    <h6 className="font-bold text-[var(--text-main)] mb-0">Verified Experience</h6>
                                                </div>
                                            </div>
                                            {canEndEmployment && (
                                                <button
                                                    className="px-4 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest border border-red-500/30 text-red-600 hover:bg-red-50 transition-all active:scale-95"
                                                    onClick={handleEndEmployment}
                                                    disabled={loading}
                                                >
                                                    End Job
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Form Section Divider */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="font-black text-[0.65rem] uppercase tracking-[0.2em] text-[var(--text-muted)] whitespace-nowrap">Experience Details</span>
                                    <div className="grow h-px bg-[var(--border-color)] opacity-50" />
                                </div>

                                {/* Form Fields */}
                                <div className="flex flex-col gap-6 md:gap-5">
                                    <div className="grid gap-6">
                                        <InputField
                                            label="Job Title / Role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            placeholder="e.g. Master Electrician"
                                            disabled={!canEdit && !isAddMode}
                                            sm={true}
                                        />
                                        <InputField
                                            label="Company Name"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="e.g. SkillAnchor Infrastructures"
                                            disabled={!canEdit && !isAddMode}
                                            sm={true}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            label="Start Date"
                                            name="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            disabled={!canEdit && !isAddMode}
                                            sm={true}
                                        />
                                        <InputField
                                            label="End Date"
                                            name="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            disabled={formData.isCurrent || (!canEdit && !isAddMode)}
                                            sm={true}
                                        />
                                    </div>

                                    {(canEdit || isAddMode) && (
                                        <div 
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${
                                                formData.isCurrent 
                                                ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/10 border-[var(--primary-200)] dark:border-[var(--primary-800)]' 
                                                : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--primary-main)]/50'
                                            }`}
                                            onClick={() => setFormData(prev => ({ ...prev, isCurrent: !prev.isCurrent }))}
                                        >
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                                                formData.isCurrent 
                                                ? 'bg-[var(--primary-main)] border-transparent' 
                                                : 'bg-transparent border-[var(--border-color)] group-hover:border-[var(--primary-main)]'
                                            }`}>
                                                {formData.isCurrent && <BadgeCheck size={14} className="text-white" />}
                                            </div>
                                            <span className={`text-sm font-bold transition-colors ${formData.isCurrent ? 'text-[var(--primary-main)]' : 'text-[var(--text-main)]'}`}>
                                                Currently working in this role
                                            </span>
                                        </div>
                                    )}

                                    <TextAreaField
                                        label="Description & Responsibilities"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Briefly describe your core responsibilities and any significant achievements in this role..."
                                        disabled={!canEdit && !isAddMode}
                                        sm={true}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Sticky Footer */}
                        <div className={`px-6 py-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] shrink-0 flex items-center gap-4 ${isMobile ? 'pb-[calc(1.5rem+env(safe-area-inset-bottom))]' : 'rounded-b-[24px]'}`}>
                            {!isAddMode && canEdit && (
                                <button
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-500 border border-red-100 bg-red-50/30 hover:bg-red-50 hover:border-red-200 transition-all active:scale-90 group"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    title="Delete Experience"
                                >
                                    <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                                </button>
                            )}
                            
                            <div className="flex-1" />
                            
                            <button 
                                className="px-6 py-3 text-[0.8rem] font-black uppercase tracking-[0.1em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors" 
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            
                            {(canEdit || isAddMode) && (
                                <button 
                                    onClick={handleSave} 
                                    disabled={loading}
                                    className="relative overflow-hidden group auth-submit-btn !py-3.5 !px-10 rounded-2xl text-sm font-bold hover:opacity-90 active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[var(--primary-main)]/10"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {loading ? 'Processing...' : (isAddMode ? 'Create Record' : 'Save Changes')}
                                        {!loading && <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>}
                                    </span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
