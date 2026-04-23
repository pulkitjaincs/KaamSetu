"use client";

import React, { useState, useEffect, useRef } from 'react';
import { JOB_CATEGORIES } from '../../constants/jobConstants';
import { LayoutGrid, Briefcase, MapPin } from 'lucide-react';

interface SearchHeroProps {
    onSearch: (params: { search: string; location: string; category: string }) => void;
    initialSearchQuery?: string;
    initialLocation?: string;
    initialCategory?: string;
}

const SearchHero = ({
    onSearch,
    initialSearchQuery = '',
    initialLocation = '',
    initialCategory = 'All'
}: SearchHeroProps) => {
    const [search, setSearch] = useState(initialSearchQuery);
    const [location, setLocation] = useState(initialLocation);
    const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');
    const heroRef = useRef<HTMLDivElement>(null);

    const categories = [{ name: 'All', icon: LayoutGrid }, ...JOB_CATEGORIES];

    useEffect(() => { setSearch(initialSearchQuery); }, [initialSearchQuery]);
    useEffect(() => { setLocation(initialLocation); }, [initialLocation]);
    useEffect(() => { setActiveCategory(initialCategory || 'All'); }, [initialCategory]);

    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                window.dispatchEvent(new CustomEvent('hero-visibility', {
                    detail: { visible: entry.isIntersecting }
                }));
            },
            { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ search, location, category: activeCategory === 'All' ? '' : activeCategory });
    };

    const handleCategoryClick = (cat: string) => {
        setActiveCategory(cat);
        onSearch({ search, location, category: cat === 'All' ? '' : cat });
    };

    return (
        <div className="max-w-[1200px] mx-auto animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)] mb-2 mt-4" ref={heroRef}>
            {/* Bold editorial headline — left-aligned */}
            <div className="mb-6">
                <h1 className="font-plus-jakarta font-extrabold tracking-tight leading-[1.1] text-text-main text-left max-w-[640px] text-4xl md:text-5xl lg:text-6xl mb-3">
                    Precision Careers for{' '}
                    <span className="text-[#0056b6] dark:text-[#6ea8fe]">Master Craftsmen.</span>
                </h1>
            </div>

            {/* Search bar — horizontal with icon inputs */}
            <div className="bg-bg-card border border-border-color rounded-2xl p-3 max-w-full transition-all focus-within:border-[#0056b6] focus-within:shadow-[0_20px_40px_-10px_rgba(0,86,182,0.12)] dark:focus-within:shadow-[0_20px_40px_-10px_rgba(0,86,182,0.25)] focus-within:-translate-y-0.5">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center w-full gap-1">
                    <div className="flex items-center gap-3 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-border-color/50">
                        <Briefcase className="text-[#0056b6] shrink-0" size={20} />
                        <input
                            type="text"
                            placeholder="Job title or skill"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none w-full font-plus-jakarta text-base font-medium text-text-main placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-3 w-full px-4 py-2">
                        <MapPin className="text-text-muted shrink-0" size={20} />
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-transparent border-none outline-none w-full font-plus-jakarta text-base font-medium text-text-main placeholder:text-zinc-400"
                        />
                    </div>

                    <button type="submit" className="w-full md:w-auto md:ml-auto bg-gradient-to-br from-[#0056b6] to-[#006ee5] text-white border-none font-plus-jakarta font-bold text-[0.8rem] uppercase tracking-[0.15em] px-8 py-4 rounded-xl cursor-pointer shadow-[0_8px_20px_rgba(0,86,182,0.2)] transition-all hover:opacity-90 hover:-translate-y-px active:scale-95 whitespace-nowrap shrink-0">
                        Search
                    </button>
                </form>
            </div>

            {/* Category chips — horizontal scroll */}
            <div className="mt-10">
                <div className="font-plus-jakarta text-[0.7rem] font-bold uppercase tracking-[0.15em] text-text-muted mb-3">Top Industries</div>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 -mx-1 scrollbar-hide">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`flex shrink-0 items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap cursor-pointer transition-all duration-300 border-none outline-none shadow-sm ${
                                    isActive 
                                        ? 'bg-[#0056b6] text-white shadow-lg shadow-[#0056b6]/30 ring-1 ring-[#0056b6] -translate-y-0.5' 
                                        : 'bg-white dark:bg-[#1a1c23] text-slate-600 dark:text-slate-300 ring-1 ring-slate-900/5 dark:ring-white/5 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0056b6] dark:hover:text-[#6ea8fe] hover:-translate-y-0.5'
                                }`}
                            >
                                <cat.icon size={16} />
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>
            
            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default SearchHero;
