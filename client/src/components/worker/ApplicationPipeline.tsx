"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Eye, Star, Trophy, XCircle } from 'lucide-react';
import { ApplicationStatus } from '@/types';

interface ApplicationPipelineProps {
  status: ApplicationStatus;
}

const ApplicationPipeline = ({ status }: ApplicationPipelineProps) => {
  const steps = [
    { id: 'applied', label: 'Applied', icon: Clock },
    { id: 'reviewed', label: 'Reviewed', icon: Eye },
    { id: 'shortlisted', label: 'Shortlisted', icon: Star },
    { id: 'hired', label: 'Hired', icon: Trophy },
  ];

  const getStepStatus = (stepId: string) => {
    if (status === 'rejected') return 'failed';
    if (status === 'employment-ended') return 'ended';

    const statusIndex = [
      'pending',
      'reviewed',
      'shortlisted',
      'hired'
    ].indexOf(status);

    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (statusIndex >= stepIndex) return 'completed';
    if (statusIndex === stepIndex - 1) return 'next';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto py-0.75">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.id);
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 relative z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: stepStatus === 'completed' ? [1, 1.1, 1] : 1,
                  backgroundColor: 
                    stepStatus === 'completed' ? 'var(--primary-500, #6366f1)' :
                    stepStatus === 'failed' ? '#ef4444' :
                    'var(--bg-surface, #f8fafc)'
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  stepStatus === 'completed' ? 'border-indigo-600 text-white' :
                  stepStatus === 'failed' ? 'border-red-500 text-red-500' :
                  'border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                {stepStatus === 'completed' ? (
                  <Check size={16} />
                ) : stepStatus === 'failed' ? (
                  <XCircle size={16} />
                ) : (
                  <Icon size={16} />
                )}
              </motion.div>
              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                stepStatus === 'completed' ? 'text-indigo-600 dark:text-indigo-400' :
                stepStatus === 'failed' ? 'text-red-500' :
                'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-grow h-[2px] mx-2 bg-slate-100 dark:bg-slate-800 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: stepStatus === 'completed' ? '100%' : '0%' 
                  }}
                  className="absolute top-0 left-0 h-full bg-indigo-500"
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ApplicationPipeline;
