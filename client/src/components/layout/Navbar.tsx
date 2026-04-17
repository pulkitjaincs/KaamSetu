/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Menu, Sun, Moon, Monitor, Smartphone, ChevronDown, User, Settings, LogOut, X } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

function NavbarContent() {
  const { user: authUser, logout } = useAuth();

  const profile = null;

  const user = useMemo(() => {
    if (!authUser) return null;
    return { ...authUser, ...(profile || {}) };
  }, [authUser, profile]);

  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [theme, setTheme] = useState("light");
  const [heroVisible, setHeroVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const compactSearchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [compactSearch, setCompactSearch] = useState(searchParams.get('search') || '');
  const [compactLocation, setCompactLocation] = useState(searchParams.get('location') || '');

  const isHomePage = pathname === '/';
  const showCompactSearch = isHomePage && !heroVisible;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompactSearch(searchParams.get('search') || '');
    setCompactLocation(searchParams.get('location') || '');
  }, [searchParams]);

  useEffect(() => {
    const handler = (e: Event) => setHeroVisible((e as CustomEvent<{ visible: boolean }>).detail?.visible ?? true);
    window.addEventListener('hero-visibility', handler);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isHomePage) setHeroVisible(true);
    return () => window.removeEventListener('hero-visibility', handler);
  }, [isHomePage]);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = theme === "dark";
      if (theme === "system") isDark = mediaQuery.matches;

      if (isDark) {
        root.setAttribute("data-theme", "dark");
        root.classList.add("dark");
      } else {
        root.removeAttribute("data-theme");
        root.classList.remove("dark");
      }
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push('/');
      }
      setSearchActive(false);
    }
  };

  const executeCompactSearch = () => {
    const params = new URLSearchParams();
    if (compactSearch.trim()) params.set('search', compactSearch.trim());
    if (compactLocation.trim()) params.set('location', compactLocation.trim());
    const currentCategory = searchParams.get('category');
    if (currentCategory) params.set('category', currentCategory);

    router.push(`/?${params.toString()}`);
  };

  const handleCompactSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCompactSearch();
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed !top-0 lg:!top-6 left-0 right-0 z-[1300] mx-auto w-full lg:w-[95%] max-w-7xl flex items-center justify-between px-4 lg:px-6 py-3 rounded-b-3xl lg:rounded-2xl backdrop-blur-2xl transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-[#1a1c23]/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-none ring-1 ring-slate-900/5 dark:ring-white/5" : "bg-white/60 dark:bg-[#1a1c23]/60 border-none ring-1 ring-slate-900/5 dark:ring-white/5"
      }`}
    >
      <div className="flex items-center space-x-6 h-full">
        {/* LOGO */}
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link href="/" className="flex items-center space-x-2 text-slate-900 dark:text-white no-underline">
            <BrandLogo iconSize={36} />
            <span className="font-bold tracking-tight text-lg">SkillAnchor</span>
          </Link>
        </motion.div>

        {/* COMPACT SEARCH FOR HOMEPAGE W/ HIDDEN HERO */}
        {isHomePage && (
          <div
            className={`hidden lg:flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              showCompactSearch ? "max-w-[480px] opacity-100 pl-4" : "max-w-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center rounded-full h-[38px] min-w-[340px] bg-white/40 dark:bg-black/40 backdrop-blur-lg border-none ring-1 ring-slate-200/50 dark:ring-white/10 overflow-hidden shadow-sm transition-all hover:bg-white/50 dark:hover:bg-black/50">
              <div className="flex items-center flex-grow pl-4 pr-3">
                <Search size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
                <input
                  ref={compactSearchRef}
                  type="text"
                  value={compactSearch}
                  onChange={(e) => setCompactSearch(e.target.value)}
                  onKeyDown={handleCompactSearch}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs font-semibold text-slate-800 dark:text-white pl-2"
                  placeholder="Search jobs..."
                />
              </div>

              <div className="w-[1px] h-[16px] bg-slate-300 dark:bg-slate-700/50 shrink-0 mx-1"></div>

              <div className="flex items-center px-3 min-w-[110px]">
                <MapPin size={13} className="text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={compactLocation}
                  onChange={(e) => setCompactLocation(e.target.value)}
                  onKeyDown={handleCompactSearch}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs font-semibold text-slate-800 dark:text-white pl-2"
                  placeholder="Location..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1, filter: "brightness(1.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={executeCompactSearch}
                className="flex items-center justify-center shrink-0 h-full px-3.5 rounded-none text-white text-[11px] font-bold border-none bg-indigo-600 shadow-sm transition-all"
              >
                Search
              </motion.button>
            </div>
          </div>
        )}

        {/* UNIVERSAL SEARCH FOR OTHER PAGES */}
        {!isHomePage && (
          <div className={`hidden lg:flex items-center relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${searchActive ? "w-[340px]" : "w-[240px]"}`}>
            <div
              className={`absolute w-full h-[40px] flex items-center rounded-2xl overflow-hidden cursor-text transition-all duration-300 border-none ring-1 ${
                searchActive 
                  ? "bg-white dark:bg-[#121212] ring-indigo-400 dark:ring-indigo-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)]" 
                  : "bg-white/40 dark:bg-black/40 ring-slate-200/50 dark:ring-white/10"
              }`}
              onClick={() => {
                setSearchActive(true);
                inputRef.current?.focus();
              }}
            >
              <Search size={16} className={`ml-4 transition-colors duration-200 ${searchActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-slate-900 dark:text-white pl-3 pr-4"
                placeholder="Search jobs..."
                onFocus={() => setSearchActive(true)}
                onBlur={() => setSearchActive(false)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* MOBILE SEARCH TOGGLE */}
        {!isHomePage && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden flex shrink-0 items-center justify-center w-10 h-10 rounded-xl bg-white/40 dark:bg-black/40 border-none ring-1 ring-slate-200/50 dark:ring-white/10 shadow-sm text-slate-900 dark:text-white"
            onClick={() => {
              setSearchActive(!searchActive);
              setMobileMenuOpen(false);
            }}
          >
            {searchActive ? <X size={18} /> : <Search size={18} />}
          </motion.button>
        )}

        {/* MOBILE MENU TOGGLE */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden flex shrink-0 items-center justify-center w-10 h-10 rounded-xl bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/10 shadow-sm text-slate-900 dark:text-white"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            setSearchActive(false);
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center space-x-1">
          {user?.role === 'employer' && (
            <>
              <Link href="/my-jobs" className="px-3 py-2 text-sm font-semibold tracking-tight text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 no-underline">My Jobs</Link>
              <Link href="/my-team" className="px-3 py-2 text-sm font-semibold tracking-tight text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 no-underline">My Team</Link>
            </>
          )}

          {user?.role === 'worker' && (
            <Link href="/my-applications" className="px-3 py-2 text-sm font-semibold tracking-tight text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 no-underline">My Applications</Link>
          )}
          
          <Link href="/companies" className="px-3 py-2 text-sm font-semibold tracking-tight text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 no-underline">Companies</Link>

          {/* THEME TOGGLE */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/40 dark:bg-black/40 border-none ring-1 ring-slate-200/50 dark:ring-white/10 text-slate-700 dark:text-slate-200 mx-2 shadow-sm overflow-hidden"
              title={`Current theme: ${theme}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute flex items-center justify-center"
                >
                  {theme === "light" && <Sun size={18} />}
                  {theme === "dark" && <Moon size={18} />}
                  {theme === "system" && <Monitor size={18} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

          {/* USER PROFILE OR LOGIN */}
          {user ? (
            <div ref={dropdownRef} className="relative z-50">
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-2xl bg-white/50 dark:bg-black/50 border-none ring-1 ring-slate-200/50 dark:ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div 
                  className="relative flex items-center justify-center rounded-xl w-8 h-8 font-bold text-white text-xs shadow-md shrink-0 overflow-hidden"
                  style={{ background: user.avatar ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill priority sizes="32px" className="object-cover" unoptimized />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white">
                  {user.name}
                </span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </motion.div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute right-0 top-full mt-4 min-w-[280px] p-3 rounded-2xl bg-white dark:bg-[#1a1c23] border-none ring-1 ring-slate-900/5 dark:ring-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50"
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
                    
                    <div className="relative mb-2 p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10">
                      <div className="flex items-center gap-3">
                        <div 
                          className="relative flex items-center justify-center rounded-xl w-12 h-12 font-bold text-white text-lg shadow-lg shadow-indigo-500/30 shrink-0 overflow-hidden"
                          style={{ background: user.avatar ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                          {user.avatar ? (
                            <Image src={user.avatar} alt={user.name} fill priority sizes="48px" className="object-cover" unoptimized />
                          ) : (
                            user.name?.charAt(0)?.toUpperCase()
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h6 className="m-0 font-bold text-base tracking-tight truncate text-slate-900 dark:text-white">{user.name}</h6>
                          <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                            {user.email || 'Worker Account'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 relative z-10">
                      <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200 text-slate-700 dark:text-slate-200 font-semibold text-sm no-underline">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <User size={16} />
                        </div>
                        My Profile
                      </Link>
                      
                      <Link href="/profile/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200 text-slate-700 dark:text-slate-200 font-semibold text-sm no-underline">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400">
                          <Settings size={16} />
                        </div>
                        Account Settings
                      </Link>
                      
                      <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 my-1 mx-2"></div>
                      
                      <button onClick={() => { handleLogout(); setDropdownOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors duration-200 text-red-500 font-semibold text-sm border-none bg-transparent cursor-pointer">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 text-red-500">
                          <LogOut size={16} />
                        </div>
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/login" className="px-4 py-2 rounded-xl font-bold text-sm tracking-tight text-white bg-slate-900 dark:bg-slate-100 dark:!text-slate-900 shadow-md shadow-slate-900/20 dark:shadow-white/10 no-underline">
                Sign In
              </Link>
            </motion.div>
          )}
        </nav>
      </div>

      {/* MOBILE SEARCH OVERLAY (Independent) */}
      <AnimatePresence>
        {searchActive && !isHomePage && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.8, y: -10 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.8, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 z-[1200] lg:hidden"
          >
            <div className="flex items-center rounded-2xl px-4 py-3 bg-white dark:bg-[#1a1c23] border-none ring-1 ring-slate-900/5 dark:ring-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Search size={18} className="text-indigo-500 mr-3 shrink-0" />
              <input
                autoFocus
                type="text"
                className="w-full bg-transparent border-none outline-none text-base font-semibold text-slate-900 dark:text-white"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="border-none bg-transparent text-slate-400">
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU DROPDOWN (Simplified) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 p-3 rounded-2xl bg-white dark:bg-[#1a1c23] border-none ring-1 ring-slate-900/5 dark:ring-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden lg:hidden flex flex-col gap-2"
          >
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#121212] border-none ring-1 ring-slate-900/5 dark:ring-white/5">
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm italic uppercase tracking-wider">Appearance</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-700 dark:text-slate-200 border-none overflow-hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="absolute flex items-center justify-center"
                  >
                    {theme === "light" && <Sun size={18} />}
                    {theme === "dark" && <Moon size={18} />}
                    {theme === "system" && <Smartphone size={18} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>

            {user && (
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors border-none cursor-pointer group"
              >
                <span className="font-bold text-red-600 dark:text-red-400 text-sm tracking-tight">Logout</span>
                <LogOut size={18} className="text-red-600 dark:text-red-400" />
              </button>
            )}

            {!user && (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl font-bold text-sm tracking-tight text-white bg-slate-900 dark:bg-slate-100 dark:!text-slate-900 shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] no-underline"
              >
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-[76px] w-full"></div>}>
      <NavbarContent />
    </Suspense>
  )
}
