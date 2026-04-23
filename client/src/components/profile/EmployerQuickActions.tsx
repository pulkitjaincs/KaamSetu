import { memo } from 'react';
import Link from 'next/link';
import { Plus, Briefcase, Users, LayoutGrid } from 'lucide-react';

const cardStyle = { borderRadius: '20px', background: 'var(--bg-card)' };
const actionBgStyle = { background: 'var(--bg-surface)', transition: 'background-color 0.2s ease, transform 0.2s ease' };

const actions = [
    { href: '/post-job', iconBg: 'rgba(99, 102, 241, 0.1)', iconColor: 'var(--primary-600)', icon: Plus, title: 'Post a New Job', subtitle: 'Find workers for your business' },
    { href: '/my-jobs', iconBg: 'rgba(34, 197, 94, 0.1)', iconColor: '#22c55e', icon: Briefcase, title: 'View My Jobs', subtitle: 'Manage your job listings' },
    { href: '/my-team', iconBg: 'rgba(59, 130, 246, 0.1)', iconColor: '#3b82f6', icon: Users, title: 'My Team', subtitle: 'Manage your hired workers' },
];

const EmployerQuickActions = memo(() => (
    <div className="border-0 shadow-sm mb-4 p-4" style={cardStyle}>
            <h5 className="font-bold mb-4" style={{ color: 'var(--text-main)' }}>
                <LayoutGrid className="mr-2 inline-block" style={{ width: '1.25rem', height: '1.25rem', verticalAlign: 'text-bottom' }} />Quick Actions
            </h5>
            <div className="flex flex-col gap-3">
                {actions.map(action => (
                    <Link key={action.href} href={action.href} className="flex items-center gap-3 p-3 rounded-2xl no-underline" style={actionBgStyle}>
                        <div className="flex items-center justify-center rounded-full"
                            style={{ width: '44px', height: '44px', background: action.iconBg }}>
                            {(() => {
                                const Icon = action.icon;
                                return <Icon style={{ color: action.iconColor, width: '1.25rem', height: '1.25rem' }} />;
                            })()}
                        </div>
                        <div>
                            <p className="mb-0 font-semibold" style={{ color: 'var(--text-main)' }}>{action.title}</p>
                            <p className="mb-0 text-sm" style={{ color: 'var(--text-muted)' }}>{action.subtitle}</p>
                        </div>
                    </Link>
                ))}
            </div>
    </div>
));

EmployerQuickActions.displayName = 'EmployerQuickActions';
export default EmployerQuickActions;
