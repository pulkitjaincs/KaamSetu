import Link from 'next/link';
import { Metadata } from 'next';
import { Home } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Page Not Found | SkillAnchor',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="text-center max-w-2xl mx-auto px-4">
                <div className="mb-6 relative">
                    <span className="font-black text-9xl tracking-tighter text-indigo-100 dark:text-indigo-900/30 drop-shadow-xl">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-extrabold text-4xl text-slate-900 dark:text-white mt-12">
                            Oops!
                        </span>
                    </div>
                </div>
                <h1 className="font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white mb-4 tracking-tight">
                    Page Not Found
                </h1>
                <p className="mx-auto mb-10 text-slate-500 dark:text-slate-400 text-lg max-w-md">
                    The page you&apos;re looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
