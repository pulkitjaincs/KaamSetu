"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase, FileText, User, LayoutDashboard, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = user?.role === 'employer' 
    ? [
        { label: 'Jobs', icon: Briefcase, href: '/' },
        { label: 'My Jobs', icon: LayoutDashboard, href: '/my-jobs' },
        { label: 'My Team', icon: Users, href: '/my-team' },
        { label: 'Profile', icon: User, href: '/profile' },
      ]
    : [
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

          return (
            <Link key={item.label} href={item.href} className="no-underline relative group py-2 px-4">
              <div className={`flex flex-col items-center gap-1 relative ${
                isActive ? 'text-[var(--primary-main)]' : 'text-[var(--text-muted)]'
              }`}>
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--primary-main)]"
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
