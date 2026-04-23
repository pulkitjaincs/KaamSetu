import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} SkillAnchor, Inc.
                </div>

                <div className="flex gap-6">
                    <Link className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline" href="/privacy">Privacy</Link>
                    <Link className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline" href="/terms">Terms</Link>
                </div>

                <div className="flex gap-6 text-slate-400 dark:text-slate-500">
                    <Facebook className="w-5 h-5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
                    <Instagram className="w-5 h-5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
                    <Twitter className="w-5 h-5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
                </div>
            </div>
        </footer>
    );
}
