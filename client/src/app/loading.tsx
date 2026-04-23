export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh] bg-slate-50 dark:bg-[#0f1117]">
            <div className="animate-spin rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-500 mb-4 w-12 h-12" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <p className="font-medium text-slate-500 dark:text-slate-400">Loading SkillAnchor...</p>
        </div>
    );
}
