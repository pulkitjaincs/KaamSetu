import ProfileClient from './ProfileClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata = {
    title: 'My Profile | SkillAnchor',
    description: 'View and manage your SkillAnchor profile.',
};

export default function MyProfilePage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
            <ProfileClient />
        </Suspense>
    );
}
