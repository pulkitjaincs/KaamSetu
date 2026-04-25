"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "@/hooks";
import { InputField, SelectField, TextAreaField} from '@/components/common/FormComponents';
import { CATEGORY_OPTIONS } from '@/constants/jobConstants';
import { useJobDetails, useUpdateJob } from '@/hooks/queries/useApplications';
import { Edit, AlertTriangle, Loader2 } from 'lucide-react';

export default function EditJobPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [error, setError] = useState('');

    const { data: job, isLoading: loading } = useJobDetails(id);
    const updateMutation = useUpdateJob();

    const { values: formData, handleChange, setValues } = useForm({
        title: "",
        description: "",
        category: "",
        subcategory: "",
        city: "",
        state: "",
        locality: "",
        salaryMin: "",
        salaryMax: "",
        salaryType: "monthly",
        jobType: "full-time",
        shift: "day",
        experienceMin: "0",
        skills: "",
        gender: "any",
        benefits: "",
        vacancies: "1",
        status: "active"
    });

    useEffect(() => {
        if (job) {
            setValues({
                title: job.title || '',
                description: job.description || '',
                category: job.category || '',
                subcategory: job.subcategory || '',
                city: job.city || '',
                state: job.state || '',
                locality: job.locality || '',
                salaryMin: String(job.salaryMin ?? ''),
                salaryMax: String(job.salaryMax ?? ''),
                salaryType: job.salaryType || 'monthly',
                jobType: job.jobType || 'full-time',
                shift: job.shift || 'day',
                experienceMin: String(job.experienceMin ?? 0),
                skills: job.skills?.join(', ') || '',
                gender: job.gender || 'any',
                benefits: job.benefits?.join(', ') || '',
                vacancies: String(job.vacancies ?? 1),
                status: job.status || 'active'
            });
        }
    }, [job, setValues]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const jobData = {
                ...formData,
                skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
                benefits: formData.benefits.split(',').map((b: string) => b.trim()).filter(Boolean),
                salaryMin: Number(formData.salaryMin),
                salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
                experienceMin: Number(formData.experienceMin),
                vacancies: Number(formData.vacancies)
            };
            await updateMutation.mutateAsync({ id, data: jobData as Partial<import('@/types').Job> });
            router.push('/my-jobs');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
            setError(axiosErr.response?.data?.message || axiosErr.response?.data?.error || 'Failed to update job');
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-bg-body bg-[radial-gradient(at_0%_0%,rgba(99,102,241,0.03)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,86,182,0.03)_0px,transparent_50%)] dark:bg-[radial-gradient(at_0%_0%,rgba(99,102,241,0.07)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,86,182,0.07)_0px,transparent_50%)]">
            <div className="w-full max-w-7xl mx-auto px-4 py-12 lg:py-20">
                <div className="flex justify-center">
                    <div className="w-full lg:w-10/12 xl:w-8/12">
                        <Link href="/my-jobs" className="no-underline inline-flex items-center mb-8 text-text-muted text-sm font-semibold hover:text-primary-500 hover:-translate-x-1 transition-all">
                            <span className="mr-2">←</span> Back to My Jobs
                        </Link>
                        
                        <div className="bg-bg-card rounded-[32px] border border-border-color shadow-2xl backdrop-blur-sm">
                            {/* Premium Header */}
                            <div className="bg-zinc-900 dark:bg-zinc-50 p-8 lg:p-12 text-white dark:text-zinc-900 relative overflow-hidden rounded-t-[32px]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                <div className="relative z-10">
                                    <h2 className="font-extrabold mb-3 text-white dark:text-zinc-900 text-3xl md:text-4xl tracking-tight flex items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-zinc-900/5 flex items-center justify-center mr-4">
                                            <Edit className="w-6 h-6" />
                                        </div>
                                        Edit Job Details
                                    </h2>
                                    <p className="mb-0 text-white/70 dark:text-zinc-900/60 font-medium text-lg">Update your posting to attract the right candidates</p>
                                </div>
                            </div>

                            <div className="p-6 lg:p-14">
                                {error && (
                                    <div className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl p-5 flex items-center mb-10 animate-shake">
                                        <AlertTriangle className="w-6 h-6 mr-4 flex-shrink-0" />
                                        <span className="font-semibold">{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-12">
                                    {/* Section: Basic Info */}
                                    <div className="space-y-6">
                                        <h6 className="uppercase font-bold flex items-center text-primary-500 text-xs tracking-[0.2em]">
                                            Basic Information
                                            <span className="ml-4 flex-grow h-px bg-border-color"></span>
                                        </h6>
                                        <div className="space-y-6">
                                            <InputField label="Job Title" name="title" value={formData.title} onChange={handleChange} required />
                                            <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} rows={6} required />
                                            <SelectField
                                                label="Status"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                options={[
                                                    { label: 'Active', value: 'active' },
                                                    { label: 'Paused', value: 'paused' },
                                                    { label: 'Closed', value: 'closed' }
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {/* Section: Location */}
                                    <div className="space-y-6">
                                        <h6 className="uppercase font-bold flex items-center text-primary-500 text-xs tracking-[0.2em]">
                                            Location & Category
                                            <span className="ml-4 flex-grow h-px bg-border-color"></span>
                                        </h6>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <SelectField
                                                label="Category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                options={CATEGORY_OPTIONS}
                                                required
                                            />
                                            <InputField label="City" name="city" value={formData.city} onChange={handleChange} required />
                                            <InputField label="State" name="state" value={formData.state} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    {/* Section: Compensation */}
                                    <div className="space-y-6">
                                        <h6 className="uppercase font-bold flex items-center text-primary-500 text-xs tracking-[0.2em]">
                                            Compensation
                                            <span className="ml-4 flex-grow h-px bg-border-color"></span>
                                        </h6>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <InputField label="Min Salary" name="salaryMin" type="number" value={formData.salaryMin} onChange={handleChange} required />
                                            <InputField label="Max Salary" name="salaryMax" type="number" value={formData.salaryMax} onChange={handleChange} />
                                            <SelectField
                                                label="Salary Type" name="salaryType" value={formData.salaryType} onChange={handleChange}
                                                options={[{ label: 'Monthly', value: 'monthly' }, { label: 'Daily', value: 'daily' }, { label: 'Hourly', value: 'hourly' }]}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Section: Job Details */}
                                    <div className="space-y-6">
                                        <h6 className="uppercase font-bold flex items-center text-primary-500 text-xs tracking-[0.2em]">
                                            Job Details
                                            <span className="ml-4 flex-grow h-px bg-border-color"></span>
                                        </h6>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <SelectField
                                                label="Job Type" name="jobType" value={formData.jobType} onChange={handleChange}
                                                options={[{ label: 'Full Time', value: 'full-time' }, { label: 'Part Time', value: 'part-time' }, { label: 'Contract', value: 'contract' }]}
                                                required
                                            />
                                            <SelectField
                                                label="Shift" name="shift" value={formData.shift} onChange={handleChange}
                                                options={[{ label: 'Day', value: 'day' }, { label: 'Night', value: 'night' }, { label: 'Flexible', value: 'flexible' }]}
                                            />
                                            <InputField label="Vacancies" name="vacancies" type="number" value={formData.vacancies} onChange={handleChange} placeholder="1" />
                                        </div>
                                    </div>

                                    {/* Section: Requirements */}
                                    <div className="space-y-6">
                                        <h6 className="uppercase font-bold flex items-center text-primary-500 text-xs tracking-[0.2em]">
                                            Skills & Benefits
                                            <span className="ml-4 flex-grow h-px bg-border-color"></span>
                                        </h6>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputField label="Skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="Cooking, Hindi (comma separated)" />
                                            <InputField label="Benefits" name="benefits" value={formData.benefits} onChange={handleChange} placeholder="Food, Accommodation (comma separated)" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 pt-8">
                                        <button 
                                            type="button" 
                                            onClick={() => router.push('/my-jobs')}
                                            className="flex-1 rounded-2xl py-4 font-bold text-text-main bg-bg-surface border border-border-color hover:bg-border-color transition-all flex items-center justify-center text-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={updateMutation.isPending}
                                            className="flex-[2] rounded-2xl py-4 font-bold auth-submit-btn active:scale-[0.98] shadow-lg shadow-zinc-500/10 transition-all flex items-center justify-center gap-3 text-lg"
                                        >
                                            {updateMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
