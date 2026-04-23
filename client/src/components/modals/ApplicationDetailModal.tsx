"use client";

import Link from 'next/link';
import { Application } from '@/types';
import { formatDate, formatSalary } from '@/utils/index';
import { MapPin, IndianRupee, ExternalLink } from 'lucide-react';

interface ApplicationDetailModalProps {
    selectedApp: Application;
    onClose: () => void;
    getStatusBadge: (status: string) => React.ReactNode;
}

export default function ApplicationDetailModal({ selectedApp, onClose, getStatusBadge }: ApplicationDetailModalProps) {
    if (!selectedApp) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div className="w-full mx-4" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div className="relative" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                    <button onClick={onClose}
                        className="absolute top-3 right-3 p-0 z-10"
                        style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1, transition: 'color 0.2s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
                        ×
                    </button>
                    <div className="p-6 pb-3">
                        <h5 className="font-bold" style={{ color: 'var(--text-main)' }}>
                            {selectedApp.job?.title}
                        </h5>
                    </div>
                    <div className="px-6 pb-4">
                        <div className="flex flex-wrap items-center gap-3 mb-3" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <span className="flex items-center"><MapPin className="mr-1" style={{ width: '1rem', height: '1rem' }} />{selectedApp.job?.city}, {selectedApp.job?.state}</span>
                            <span className="flex items-center"><IndianRupee className="mr-1" style={{ width: '1rem', height: '1rem' }} />{formatSalary(selectedApp.job?.salaryMin, selectedApp.job?.salaryMax)}</span>
                        </div>

                        <div className="mb-3">
                            <small style={{ color: 'var(--text-muted)' }}>Status</small>
                            <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                        </div>

                        <div className="mb-3">
                            <small style={{ color: 'var(--text-muted)' }}>Your Cover Note</small>
                            <div className="p-3 mt-1 rounded-xl" style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>
                                {selectedApp.coverNote || <em style={{ color: 'var(--text-muted)' }}>No cover note provided</em>}
                            </div>
                        </div>

                        <div>
                            <small style={{ color: 'var(--text-muted)' }}>Applied On</small>
                            <div style={{ color: 'var(--text-main)' }}>
                                {formatDate(selectedApp.appliedAt)}
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-6 pt-0">
                        <Link href={`/jobs/${selectedApp.job?._id}`} className="rounded-full px-4 py-2 block text-center w-full"
                            style={{ background: 'var(--primary-500)', color: 'white', textDecoration: 'none', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <ExternalLink className="inline-block mr-1" style={{ width: '1.2rem', height: '1.2rem', verticalAlign: 'middle' }} /> View Full Job
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
