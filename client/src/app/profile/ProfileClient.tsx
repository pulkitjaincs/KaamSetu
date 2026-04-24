"use client";

import { useState, useMemo, useCallback, lazy, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/queries/useProfile';
import { useQueryClient } from '@tanstack/react-query';
import { WorkExperience } from '@/types';

import ProfileHeader from '@/components/profile/ProfileHeader';
import SkillsSection from '@/components/profile/SkillsSection';
import WorkHistorySection from '@/components/profile/WorkHistorySection';
import EmployerQuickActions from '@/components/profile/EmployerQuickActions';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import { Wrench } from 'lucide-react';

const WorkExperienceModal = lazy(() => import('@/components/modals/WorkExperienceModal'));

export default function ProfileClient() {
    const params = useParams();
    const userId = params?.userId as string | undefined;
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const fromJobId = searchParams.get('fromJob');
    const fromTeam = searchParams.get('from') === 'team';
    const isOwnProfile = !userId;
    const router = useRouter();
    const [selectedExp, setSelectedExp] = useState<WorkExperience | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const { updateUserData } = useAuth();

    const { data: profile, isLoading: loading, isError } = useProfile(userId);

    // Sync newly fetched signed avatar URL into global auth state so Navbar updates
    useEffect(() => {
        if (profile?.avatarUrl && !userId) {
            updateUserData({ avatar: profile.avatarUrl });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.avatarUrl, userId]);

    const workHistory = useMemo(() => profile?.workHistory || [], [profile]);
    const isEmployer = profile?.role === 'employer';

    const completionPercent = useMemo(() => {
        if (!profile) return 0;
        if (profile.role === 'employer') {
            let score = 0;
            if (profile.name) score += 25;
            if (profile.phone) score += 25;
            if (profile.designation) score += 25;
            if (profile.company) score += 25;
            return Math.min(score, 100);
        }
        let score = 0;
        if (profile.name) score += 10;
        if (profile.gender) score += 10;
        if (profile.phone) score += 10;
        if (profile.city && profile.state) score += 10;
        if (profile.skills?.length && profile.skills.length > 0) score += 15;
        if (profile.languages?.length && profile.languages.length > 0) score += 10;
        if (profile.bio) score += 10;
        if (profile.expectedSalary?.min) score += 10;
        if (profile.dob) score += 5;
        if (profile.documents?.aadhaar?.number) score += 5;
        if (profile.documents?.pan?.number) score += 5;
        return Math.min(score, 100);
    }, [profile]);

    const getAge = useCallback((dob: string) => {
        if (!dob) return 0;
        const today = new Date();
        const birth = new Date(dob);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    }, []);

    const handleAddClick = useCallback(() => setShowAddModal(true), []);
    const handleExpClick = useCallback((exp: WorkExperience) => setSelectedExp(exp), []);
    const handleModalClose = useCallback(() => { setShowAddModal(false); setSelectedExp(null); }, []);
    const handleSave = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: userId ? ['profile', userId] : ['profile'] });
    }, [queryClient, userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
                <div className="w-10 h-10 border-4 rounded-full animate-spin"
                    style={{ borderColor: 'var(--primary-main)', borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    if (isError || !profile) {
        if (isOwnProfile) {
            router.push('/profile/edit');
        }
        return null;
    }

    return (
        <div className="py-5 px-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {fromJobId && (
                <div className="mb-5">
                    <Link href={`/jobs/${fromJobId}/applicants`} className="no-underline inline-flex items-center font-bold"
                        style={{ color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        <ArrowLeft className="mr-2 inline-block" size={16} /> Applicants
                    </Link>
                </div>
            )}
            {fromTeam && (
                <div className="mb-5">
                    <Link href="/my-team" className="no-underline inline-flex items-center font-bold"
                        style={{ color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        <ArrowLeft className="mr-2 inline-block" size={16} /> My Team
                    </Link>
                </div>
            )}

            <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                isEmployer={isEmployer}
                completionPercent={completionPercent}
                getAge={getAge}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    {!isEmployer && (
                        <CollapsibleSection 
                            title="Skills & Expertise" 
                            icon={<Wrench size={20} />}
                            defaultOpen={true}
                        >
                            <SkillsSection
                                skills={profile.skills}
                                languages={profile.languages}
                                isOwnProfile={isOwnProfile}
                            />
                        </CollapsibleSection>
                    )}
                    {isEmployer && <EmployerQuickActions />}
                    {!isEmployer && (
                        <WorkHistorySection
                            workHistory={workHistory}
                            isOwnProfile={isOwnProfile}
                            onAddClick={handleAddClick}
                            onExpClick={handleExpClick}
                        />
                    )}
                </div>

                <div className="lg:col-span-4">
                    <ProfileSidebar profile={profile} isEmployer={isEmployer} isOwnProfile={isOwnProfile} />
                </div>
            </div>

            <Suspense fallback={null}>
                <WorkExperienceModal
                    show={showAddModal || !!selectedExp}
                    onClose={handleModalClose}
                    experience={selectedExp ?? undefined}
                    onSave={handleSave}
                />
            </Suspense>
        </div>
    );
}
