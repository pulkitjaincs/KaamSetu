"use client";

import { useMemo, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VirtuosoGrid } from 'react-virtuoso';
import { formatDate, getInitials } from '@/utils/index';
import { useMyTeam, useEndEmployment } from '@/hooks/queries/useProfile';
import { Profile } from '@/types';
import { ArrowLeft, Users, Briefcase, MoreVertical, User, XCircle, CalendarCheck, Phone, ArrowRight } from 'lucide-react';

interface TeamMember {
    _id: string;
    worker?: Profile & { _id: string; name?: string; avatar?: string; phone?: string; };
    role?: string;
    startDate?: string;
}

export default function MyTeamPage() {
    const {
        data: teamData,
        isLoading: loading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useMyTeam();

    useEffect(() => {
        document.title = 'My Team | SkillAnchor';
    }, []);

    const team = useMemo(() => {
        return (teamData?.pages as unknown as { team: TeamMember[] }[])?.flatMap((page) => page.team) || [];
    }, [teamData]);
    const endEmploymentMutation = useEndEmployment();

    const endEmployment = async (id: string) => {
        if (!window.confirm("Are you sure you want to end this worker's employment?")) return;
        try {
            await endEmploymentMutation.mutateAsync(id);
        } catch {
            alert("Failed to end employment");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-[var(--primary-main)] border-t-transparent rounded-full animate-spin" role="status"></div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-body)] min-h-screen py-10 px-5">
            <div className="max-w-[1000px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-5 gap-3">
                    <div>
                        <Link href="/profile" className="no-underline text-sm flex items-center mb-2 text-[var(--text-muted)]">
                            <ArrowLeft className="mr-2 inline-block" size={14} />Back to Profile
                        </Link>
                        <h2 className="font-bold mb-0 text-[var(--text-main)] text-[2rem]">
                            My Team
                            <span className="ml-3 rounded-full text-[0.9rem] bg-[var(--primary-100)] text-[var(--primary-700)] px-4 py-1.5">
                                {team.length} Members
                            </span>
                        </h2>
                        <p className="mb-0 mt-1 text-[var(--text-muted)]">Manage your active workers and their roles.</p>
                    </div>
                </div>

                {/* Team Grid */}
                {team.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="inline-flex items-center justify-center rounded-full mb-4 w-[100px] h-[100px] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
                            <Users className="text-[var(--text-muted)]" size={40} />
                        </div>
                        <h4 className="font-bold mb-2">No active team members</h4>
                        <p className="text-[var(--text-muted)]">When you hire workers, they will appear here.</p>
                        <Link href="/my-jobs" className="inline-block rounded-full px-4 py-2 mt-2 no-underline font-semibold bg-[var(--primary-500)] text-white border-none">
                            View Job Applicants
                        </Link>
                    </div>
                ) : (
                    <VirtuosoGrid
                        useWindowScroll
                        data={team}
                        endReached={() => {
                            if (hasNextPage) fetchNextPage();
                        }}
                        listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        itemClassName="pb-4"
                        itemContent={(_index: number, member: TeamMember) => (
                            <TeamMemberCard
                                member={member}
                                onEndEmployment={endEmployment}
                            />
                        )}
                        components={{
                            Footer: () => isFetchingNextPage ? (
                                <div className="text-center py-3 w-full text-[var(--text-muted)]">Loading more...</div>
                            ) : null
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function TeamMemberCard({ member, onEndEmployment }: { member: TeamMember; onEndEmployment: (id: string) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="h-full overflow-hidden rounded-[24px] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
            <div className="p-4">
                {/* Member Header & Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="rounded-full flex items-center justify-center relative overflow-hidden w-16 h-16 bg-gradient-to-br from-[var(--primary-100)] to-[var(--zinc-100)]">
                                {member.worker?.avatar ? (
                                    <Image src={member.worker.avatar} alt={member.worker.name ?? ''} fill sizes="64px" className="rounded-full object-cover" />
                                ) : (
                                    <span className="font-bold text-xl text-[var(--primary-main)]">{getInitials(member.worker?.name ?? '')}</span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 rounded-full border-2 border-white w-3.5 h-3.5 bg-[#22c55e]" title="Active"></div>
                        </div>
                        <div>
                            <h5 className="font-bold mb-1 text-[var(--text-main)] tracking-[-0.02em]">{member.worker?.name || 'Unknown Member'}</h5>
                            <div className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 bg-[var(--primary-50)] text-[var(--primary-main)] text-[0.7rem]">
                                <Briefcase size={10} />
                                {member.role || 'Worker'}
                            </div>
                        </div>
                    </div>

                    {/* React-controlled dropdown — replaces broken Bootstrap data-bs-toggle */}
                    <div className="relative" ref={ref}>
                        <button
                            className="p-1 rounded-lg bg-transparent border-none text-[var(--text-muted)] cursor-pointer"
                            type="button"
                            title="More options"
                            onClick={() => setOpen(v => !v)}>
                            <MoreVertical size={20} />
                        </button>
                        {open && (
                            <div className="absolute right-0 mt-1 p-2 shadow-lg z-50 rounded-[24px] bg-[var(--bg-card)] min-w-[180px] border border-[var(--border-color)]">
                                <Link
                                    href={`/profile/${member.worker?._id}?from=team`}
                                    className="flex items-center gap-2 py-2 px-3 no-underline w-full rounded-[12px] text-[var(--text-main)] text-[0.875rem]"
                                    onClick={() => setOpen(false)}>
                                    <User className="text-[var(--text-muted)]" size={16} /> View Profile
                                </Link>
                                <hr className="my-1 opacity-30" />
                                <button
                                    onClick={() => { setOpen(false); onEndEmployment(member._id); }}
                                    className="flex items-center gap-2 py-2 px-3 w-full rounded-[12px] text-[#ba1a1a] bg-transparent border-none text-[0.875rem] cursor-pointer">
                                    <XCircle size={16} /> End Employment
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Member Secondary Info */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm opacity-75 text-[var(--text-muted)]">
                        <CalendarCheck size={16} />
                        Joined {formatDate(member.startDate)}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <a href={`tel:${member.worker?.phone}`}
                        className="flex items-center justify-center gap-2 rounded-full grow bg-[var(--primary-500)] text-white border-none font-semibold text-[0.8rem] py-1.5 px-3 no-underline">
                        <Phone size={12} /> Call Now
                    </a>
                    <Link href={`/profile/${member.worker?._id}?from=team`}
                        className="flex items-center justify-center rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] py-2 px-3 border-none"
                        title="Full Profile">
                        <ArrowRight size={24} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
