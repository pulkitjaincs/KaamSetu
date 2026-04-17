"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase, FileText, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { label: 'Jobs', icon: Briefcase, href: '/' },
    { label: 'Applied', icon: FileText, href: '/my-applications' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full z-[1100]">
      <motion.nav 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-t border-white/50 dark:border-white/10 rounded-t-3xl pt-3 px-2 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.label} href={item.href} className="no-underline relative group py-2 px-4">
              <div className="flex flex-col items-center gap-1">
                <Icon 
                  size={20} 
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                  }`} 
                />
                <span className={`text-[10px] font-bold tracking-tight uppercase ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default MobileBottomNav;
