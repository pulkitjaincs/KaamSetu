"use client";

import React, { useState, useEffect, useRef } from 'react';
import { JOB_CATEGORIES } from '../../constants/jobConstants';
import { LayoutGrid, Briefcase, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const categories = [{ name: 'All', icon: LayoutGrid }, ...JOB_CATEGORIES];

    useEffect(() => { setSearch(initialSearchQuery); }, [initialSearchQuery]);
    useEffect(() => { setLocation(initialLocation); }, [initialLocation]);
    useEffect(() => { setActiveCategory(initialCategory || 'All'); }, [initialCategory]);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

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

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = scrollRef.current.clientWidth * 0.6;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)] mb-2 mt-4" ref={heroRef}>
            {/* Bold editorial headline — left-aligned */}
            <div className="mb-6">
                <h1 className="font-plus-jakarta font-extrabold tracking-tight leading-[1.1] text-[var(--text-main)] text-left max-w-[640px] text-4xl md:text-5xl lg:text-6xl mb-3">
                    Precision Careers for{' '}
                    <span className="text-[var(--primary-main)]">Master Craftsmen.</span>
                </h1>
            </div>

            {/* Search bar — horizontal with icon inputs */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-3 max-w-full transition-all focus-within:!border-[var(--primary-main)] focus-within:shadow-[var(--shadow-lg)] focus-within:-translate-y-0.5">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center w-full gap-1">
                    <div className="flex items-center gap-3 w-full px-4 py-3 opacity-80">
                        <Briefcase className="text-[var(--primary-main)] shrink-0" size={20} />
                        <input
                            type="text"
                            placeholder="Job title or skill"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none w-full font-plus-jakarta text-base font-medium text-[var(--text-main)] placeholder:text-[var(--text-muted)] opacity-70"
                        />
                    </div>

                    {/* Shorter Separator Line */}
                    <div className="w-[85%] md:w-px h-px md:h-8 bg-[var(--border-color)]/60 mx-auto md:mx-0 shrink-0" />

                    <div className="flex items-center gap-3 w-full px-4 py-3 opacity-80">
                        <MapPin className="text-[var(--primary-main)] shrink-0" size={20} />
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-transparent border-none outline-none w-full font-plus-jakarta text-base font-medium text-[var(--text-main)] placeholder:text-[var(--text-muted)] opacity-70"
                        />
                    </div>

                    <button type="submit" className="w-full md:w-auto md:ml-auto bg-[var(--primary-main)] text-[var(--on-primary)] border-none font-plus-jakarta font-bold text-[0.8rem] uppercase tracking-[0.15em] px-8 py-4 rounded-xl cursor-pointer shadow-md shadow-[var(--ring-overlay)] transition-all hover:opacity-90 hover:-translate-y-px active:scale-95 whitespace-nowrap shrink-0">
                        Search
                    </button>
                </form>
            </div>

            {/* Category chips — horizontal scroll */}
            <div className="mt-10 relative group/cats">
                <div className="font-plus-jakarta text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">Top Industries</div>
                
                <div className="relative mx-[-1rem]">
                    {/* Left Scroll Button */}
                    <button 
                        onClick={() => scroll('left')}
                        className={`absolute left-4 top-[42%] -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl text-[var(--primary-main)] transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[var(--bg-surface)] hover:border-[var(--primary-main)] ${canScrollLeft ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none -translate-x-2'}`}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>

                    <div 
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-3 overflow-x-auto pb-4 pt-1 px-16 scrollbar-hide scroll-smooth"
                    >
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategoryClick(cat.name)}
                                    className={`flex shrink-0 items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap cursor-pointer transition-all duration-300 border-none outline-none shadow-sm ${
                                        isActive 
                                            ? 'bg-[var(--primary-main)] text-[var(--on-primary)] shadow-lg shadow-[var(--ring-overlay)] ring-1 ring-[var(--primary-main)] -translate-y-0.5' 
                                            : 'bg-[var(--bg-card)] text-[var(--text-muted)] ring-1 ring-[var(--border-color)] hover:bg-[var(--bg-surface)] hover:text-[var(--primary-main)] hover:ring-[var(--primary-main)] hover:-translate-y-0.5'
                                    }`}
                                >
                                    <cat.icon size={16} />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Scroll Button */}
                    <button 
                        onClick={() => scroll('right')}
                        className={`absolute right-4 top-[42%] -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl text-[var(--primary-main)] transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[var(--bg-surface)] hover:border-[var(--primary-main)] ${canScrollRight ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none translate-x-2'}`}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={22} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchHero;
