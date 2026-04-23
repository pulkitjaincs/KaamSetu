"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "@/hooks";
import { InputField, SelectField, TextAreaField, Button } from '@/components/common/FormComponents';
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
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            <Link href="/my-jobs" className="no-underline inline-flex items-center mb-6 text-text-muted text-sm hover:text-text-main transition-colors">
                &larr; Back to My Jobs
            </Link>
            <div className="flex justify-center">
                <div className="w-full lg:w-8/12">
                    <div className="bg-bg-card rounded-3xl border border-border-color overflow-hidden shadow-sm">
                        <div className="bg-text-main p-8 text-bg-body">
                            <h2 className="font-bold mb-2 text-bg-body text-2xl flex items-center">
                                <Edit className="w-6 h-6 mr-3" />
                                Edit Job
                            </h2>
                            <p className="mb-0 opacity-70">Update your job posting details</p>
                        </div>

                        <div className="p-6 lg:p-12">
                            {error && (
                                <div className="bg-red-100 text-red-800 border border-red-200 rounded-xl p-4 flex items-center mb-6">
                                    <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />{error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <h6 className="uppercase font-bold mb-4 flex items-center text-text-muted text-xs tracking-wider">
                                        <span className="inline-block mr-3 w-5 h-0.5 bg-primary-500 rounded-full"></span>
                                        Basic Information
                                    </h6>
                                    <div className="space-y-4">
                                        <InputField label="Job Title" name="title" value={formData.title} onChange={handleChange} required />
                                        <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required />
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
                                            <InputField label="City" name="city" value={formData.city} onChange={handleChange} required />
                                        </div>
                                        <div>
                                            <InputField label="State" name="state" value={formData.state} onChange={handleChange} required />
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
                                            <InputField label="Min Salary" name="salaryMin" type="number" value={formData.salaryMin} onChange={handleChange} required />
                                        </div>
                                        <div>
                                            <InputField label="Max Salary" name="salaryMax" type="number" value={formData.salaryMax} onChange={handleChange} />
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

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="secondary" onClick={() => router.push('/my-jobs')} fullWidth>
                                        Cancel
                                    </Button>
                                    <Button type="submit" loading={updateMutation.isPending} fullWidth>
                                        Save Changes
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
