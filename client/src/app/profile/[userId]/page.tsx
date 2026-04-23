import ProfileClient from '../ProfileClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'User Profile | SkillAnchor',
    description: 'View a user profile on SkillAnchor.',
};

export default function UserProfilePage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
            <ProfileClient />
        </Suspense>
    );
}
