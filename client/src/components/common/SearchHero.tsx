"use client";

import React, { useState, useEffect, useRef } from 'react';
import './SearchHero.css';
import { JOB_CATEGORIES } from '../../constants/jobConstants';

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

    const categories = [{ name: 'All', icon: 'bi-grid-fill' }, ...JOB_CATEGORIES];

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
        <div className="search-hero-container mb-2 mt-4" ref={heroRef}>
            {/* Bold editorial headline — left-aligned */}
            <div className="mb-4">
                <h1 className="hero-title display-4 mb-3">
                    Precision Careers for{' '}
                    <span className="hero-accent">Master Craftsmen.</span>
                </h1>
            </div>

            {/* Search bar — horizontal with icon inputs */}
            <div className="search-bar-wrapper">
                <form onSubmit={handleSearchSubmit} className="d-flex align-items-center w-100" style={{ gap: '4px' }}>
                    <div className="search-input-section" style={{ borderRight: '1px solid var(--border-color)' }}>
                        <i className="bi bi-briefcase-fill search-icon"></i>
                        <input
                            type="text"
                            placeholder="Job title or skill"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="search-input-section d-none d-md-flex">
                        <i className="bi bi-geo-alt-fill search-icon muted"></i>
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="search-cta-btn ms-auto">
                        Search
                    </button>
                </form>
            </div>

            {/* Category chips — horizontal scroll */}
            <div className="category-section">
                <div className="category-section-label">Top Industries</div>
                <div className="category-scroll-container">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`flex flex-shrink-0 items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap cursor-pointer transition-all duration-200 border-none outline-none ${
                                    isActive 
                                        ? 'bg-[#0056b6] text-white shadow-md shadow-[#0056b6]/30 ring-1 ring-[#0056b6]' 
                                        : 'bg-white dark:bg-[#1a1c23] text-slate-600 dark:text-slate-300 ring-1 ring-slate-900/5 dark:ring-white/5 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#0056b6] dark:hover:text-[#6ea8fe]'
                                }`}
                            >
                                <i className={`bi ${cat.icon}`}></i>
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SearchHero;
