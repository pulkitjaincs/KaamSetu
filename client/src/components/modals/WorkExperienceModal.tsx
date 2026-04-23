"use client";

import { useState, useEffect } from 'react';
import { workExperienceAPI } from '@/lib/api';
import { InputField, TextAreaField, Button } from '@/components/common/FormComponents';
import { Eye, EyeOff, BadgeCheck, Trash2 } from 'lucide-react';

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

    const [formData, setFormData] = useState({
        role: '',
        companyName: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
    });

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

    if (!show) return null;

    const isVerified = experience?.isVerified;
    const canEdit = !isVerified;
    const canEndEmployment = isVerified && experience?.isCurrent;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div className="w-full mx-4" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '24px'
                }}>
                    <div className="p-6 pb-3 flex justify-between items-center">
                        <h5 className="font-bold mb-0" style={{ color: 'var(--text-main)' }}>
                            {isAddMode ? 'Add Work Experience' : (canEdit ? 'Edit Experience' : 'Experience Details')}
                        </h5>
                        <button type="button" onClick={onClose}
                            style={{ background: 'none', border: 'none', fontSize: '1.5rem', lineHeight: 1, cursor: 'pointer', color: 'var(--text-muted)', filter: 'var(--icon-filter)' }}
                            aria-label="Close">
                            &times;
                        </button>
                    </div>
                    <div className="px-6 pb-4">
                        {error && (
                            <div className="py-2 mb-3 px-3 rounded-[10px]" style={{ background: 'rgba(186,26,26,0.1)', color: '#ba1a1a', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        {/* Visibility Toggle - always shown for existing experiences */}
                        {!isAddMode && (
                            <div className="flex items-center justify-between p-3 mb-3 rounded-xl"
                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                                <div>
                                    <p className="mb-0 font-semibold flex items-center" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                        {experience.isVisible !== false 
                                            ? <Eye className="mr-2" style={{ width: '1rem', height: '1rem' }} /> 
                                            : <EyeOff className="mr-2" style={{ width: '1rem', height: '1rem' }} />
                                        }
                                        {experience.isVisible !== false ? 'Visible on Profile' : 'Hidden from Profile'}
                                    </p>
                                    <p className="mb-0 text-sm" style={{ color: 'var(--text-muted)' }}>
                                        Others {experience.isVisible !== false ? 'can' : 'cannot'} see this on your profile
                                    </p>
                                </div>
                                <button
                                    className="text-sm px-3 py-1"
                                    style={{
                                        background: experience.isVisible !== false ? 'var(--bg-surface)' : 'var(--primary-500)',
                                        color: experience.isVisible !== false ? 'var(--text-muted)' : '#fff',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={handleToggleVisibility}
                                    disabled={loading}
                                >
                                    {experience.isVisible !== false ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        )}

                        {/* Verified Badge & End Employment */}
                        {isVerified && (
                            <div className="flex items-center justify-between p-3 mb-3 rounded-xl"
                                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }}>
                                <div className="flex items-center gap-2">
                                    <BadgeCheck style={{ color: '#10b981', width: '1.2rem', height: '1.2rem' }} />
                                    <span className="font-semibold" style={{ color: '#10b981' }}>Verified Experience</span>
                                </div>
                                {canEndEmployment && (
                                    <button
                                        className="text-sm px-3 py-1"
                                        style={{ borderRadius: '8px', border: '1px solid #ba1a1a', color: '#ba1a1a', background: 'transparent', cursor: 'pointer' }}
                                        onClick={handleEndEmployment}
                                        disabled={loading}
                                    >
                                        End Employment
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="flex flex-col gap-3">
                            <div>
                                <InputField
                                    label="Job Title / Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    placeholder="e.g. Electrician"
                                    disabled={!canEdit && !isAddMode}
                                    sm={true}
                                />
                            </div>
                            <div>
                                <InputField
                                    label="Company Name"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. ABC Pvt Ltd"
                                    disabled={!canEdit && !isAddMode}
                                    sm={true}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputField
                                        label="Start Date"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        disabled={!canEdit && !isAddMode}
                                        sm={true}
                                    />
                                </div>
                                <div>
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
                            </div>
                            {(canEdit || isAddMode) && (
                                <div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="isCurrent"
                                            id="modalExpCurrent"
                                            checked={formData.isCurrent}
                                            onChange={handleChange}
                                        />
                                        <label className="text-sm" style={{ color: 'var(--text-muted)' }} htmlFor="modalExpCurrent">
                                            Currently working here
                                        </label>
                                    </div>
                                </div>
                            )}
                            <div>
                                <TextAreaField
                                    label="Description (Optional)"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Describe your role..."
                                    disabled={!canEdit && !isAddMode}
                                    sm={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-6 pt-0 flex gap-3 items-center">
                        {/* Delete button - only for unverified */}
                        {!isAddMode && canEdit && (
                                <button
                                    className="rounded-full mr-auto"
                                    style={{ padding: '8px 20px', fontSize: '0.9rem', border: '1px solid #ba1a1a', color: '#ba1a1a', background: 'transparent', cursor: 'pointer' }}
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                <Trash2 className="mr-1 inline-block" style={{ width: '1rem', height: '1rem', verticalAlign: 'text-bottom' }} />Delete
                            </button>
                        )}
                        <button className="" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>Cancel</button>
                        {(canEdit || isAddMode) && (
                            <Button onClick={handleSave} loading={loading} className="rounded-full px-4">
                                {isAddMode ? 'Add Experience' : 'Save Changes'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
