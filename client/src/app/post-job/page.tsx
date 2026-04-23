"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from '@/hooks';
import { InputField, SelectField, TextAreaField, Button } from '@/components/common/FormComponents';
import { CATEGORY_OPTIONS } from '@/constants/jobConstants';
import { useCreateJob } from '@/hooks/queries/useApplications';
import { Briefcase, AlertTriangle } from 'lucide-react';

export default function PostJobPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const createMutation = useCreateJob();

    React.useEffect(() => {
        document.title = 'Post a Job | SkillAnchor';
    }, []);
    const { values: formData, handleChange } = useForm({
        title: '',
        description: '',
        category: '',
        city: '',
        state: '',
        salaryMin: '',
        salaryMax: '',
        salaryType: 'monthly',
        jobType: 'full-time',
        shift: 'day',
        experienceMin: 0,
        skills: '',
        gender: 'any',
        benefits: '',
        vacancies: 1
    });

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
            await createMutation.mutateAsync(jobData as Partial<import('@/types').Job>);
            router.push('/');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
            setError(axiosErr.response?.data?.message || axiosErr.response?.data?.error || 'Failed to post job');
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            <Link href="/my-jobs" className="no-underline inline-flex items-center mb-6 text-text-muted text-sm hover:text-text-main transition-colors">
                &larr; Back to My Jobs
            </Link>
            <div className="flex justify-center">
                <div className="w-full lg:w-8/12">
                    <div className="bg-bg-card rounded-3xl border border-border-color overflow-hidden shadow-sm">
                        {/* Premium Header */}
                        <div className="bg-text-main p-8 text-bg-body">
                            <h2 className="font-bold mb-2 text-bg-body text-2xl flex items-center">
                                <Briefcase className="w-6 h-6 mr-3" />
                                Post a New Job
                            </h2>
                            <p className="mb-0 opacity-70">Fill in the details to reach qualified workers</p>
                        </div>

                        <div className="p-6 lg:p-12">
                            {error && (
                                <div className="bg-red-100 text-red-800 border border-red-200 rounded-xl p-4 flex items-center mb-6">
                                    <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />{error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Section: Basic Info */}
                                <div>
                                    <h6 className="uppercase font-bold mb-4 flex items-center text-text-muted text-xs tracking-wider">
                                        <span className="inline-block mr-3 w-5 h-0.5 bg-primary-500 rounded-full"></span>
                                        Basic Information
                                    </h6>
                                    <div className="space-y-4">
                                        <InputField label="Job Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Kitchen Helper" required />
                                        <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe the job responsibilities..." required />
                                    </div>
                                </div>

                                {/* Section: Location */}
                                <div>
                                    <h6 className="uppercase font-bold mb-4 flex items-center text-text-muted text-xs tracking-wider">
                                        <span className="inline-block mr-3 w-5 h-0.5 bg-primary-500 rounded-full"></span>
                                        Location & Category
                                    </h6>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div>
                                            <SelectField
                                                label="Category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                options={CATEGORY_OPTIONS}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" required />
                                        </div>
                                        <div>
                                            <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Maharashtra" required />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Compensation */}
                                <div>
                                    <h6 className="uppercase font-bold mb-4 flex items-center text-text-muted text-xs tracking-wider">
                                        <span className="inline-block mr-3 w-5 h-0.5 bg-primary-500 rounded-full"></span>
                                        Compensation
                                    </h6>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div>
                                            <InputField label="Min Salary" name="salaryMin" type="number" value={formData.salaryMin} onChange={handleChange} placeholder="15000" required />
                                        </div>
                                        <div>
                                            <InputField label="Max Salary" name="salaryMax" type="number" value={formData.salaryMax} onChange={handleChange} placeholder="25000" />
                                        </div>
                                        <div>
                                            <SelectField
                                                label="Salary Type" name="salaryType" value={formData.salaryType} onChange={handleChange}
                                                options={[{ label: 'Monthly', value: 'monthly' }, { label: 'Daily', value: 'daily' }, { label: 'Hourly', value: 'hourly' }]}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Job Details */}
                                <div>
                                    <h6 className="uppercase font-bold mb-4 flex items-center text-text-muted text-xs tracking-wider">
                                        <span className="inline-block mr-3 w-5 h-0.5 bg-primary-500 rounded-full"></span>
                                        Job Details
                                    </h6>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div>
                                            <SelectField
                                                label="Job Type" name="jobType" value={formData.jobType} onChange={handleChange}
                                                options={[{ label: 'Full Time', value: 'full-time' }, { label: 'Part Time', value: 'part-time' }, { label: 'Contract', value: 'contract' }]}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <SelectField
                                                label="Shift" name="shift" value={formData.shift} onChange={handleChange}
                                                options={[{ label: 'Day', value: 'day' }, { label: 'Night', value: 'night' }, { label: 'Flexible', value: 'flexible' }]}
                                            />
                                        </div>
                                        <div>
                                            <InputField label="Vacancies" name="vacancies" type="number" value={formData.vacancies} onChange={handleChange} placeholder="1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Requirements */}
                                <div>
                                    <h6 className="uppercase font-bold mb-4 flex items-center text-text-muted text-xs tracking-wider">
                                        <span className="inline-block mr-3 w-5 h-0.5 bg-primary-500 rounded-full"></span>
                                        Skills & Benefits
                                    </h6>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <InputField label="Skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="Cooking, Hindi (comma separated)" />
                                        </div>
                                        <div>
                                            <InputField label="Benefits" name="benefits" value={formData.benefits} onChange={handleChange} placeholder="Food, Accommodation (comma separated)" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" variant="primary" loading={createMutation.isPending} fullWidth>
                                        Post Job
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
