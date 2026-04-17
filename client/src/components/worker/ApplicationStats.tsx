"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Star, Trophy, Clock } from 'lucide-react';
import { Application } from '@/types';

interface ApplicationStatsProps {
  applications: Application[];
  loading?: boolean;
}

const ApplicationStats = ({ applications, loading }: ApplicationStatsProps) => {
  const stats = [
    {
      label: 'Total Applied',
      value: applications.length,
      icon: FileCheck,
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/20'
    },
    {
      label: 'Shortlisted',
      value: applications.filter(a => a.status === 'shortlisted').length,
      icon: Star,
      color: 'bg-amber-500',
      gradient: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/20'
    },
    {
      label: 'Hired',
      value: applications.filter(a => a.status === 'hired').length,
      icon: Trophy,
      color: 'bg-emerald-500',
      gradient: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20'
    },
    {
      label: 'Pending',
      value: applications.filter(a => ['pending', 'reviewed'].includes(a.status)).length,
      icon: Clock,
      color: 'bg-slate-500',
      gradient: 'from-slate-500/10 to-transparent',
      borderColor: 'border-slate-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className={`relative overflow-hidden p-5 rounded-3xl border-none ring-1 ring-slate-900/5 dark:ring-white/5 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
          
          <div className="relative z-10 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
              <stat.icon size={18} />
            </div>
            
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ApplicationStats;
