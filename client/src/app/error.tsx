"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error Caught:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="inline-flex items-center justify-center mb-6 rounded-full w-20 h-20 bg-red-50 dark:bg-red-500/10">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h2 className="font-extrabold text-2xl mb-3 text-slate-900 dark:text-white">Something went wrong!</h2>
                <p className="mb-8 text-slate-500 dark:text-slate-400 font-medium">
                    {error.message || "An unexpected error occurred while loading this page."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
