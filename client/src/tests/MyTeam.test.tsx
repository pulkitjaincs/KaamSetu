/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyTeamPage from '@/app/(employer)/my-team/page';
import { useMyTeam, useEndEmployment } from '@/hooks/queries/useProfile';
import React from 'react';

// Mock hooks
vi.mock('@/hooks/queries/useProfile', () => ({
    useMyTeam: vi.fn(),
    useEndEmployment: vi.fn().mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false
    })
}));

// Mock VirtuosoGrid
vi.mock('react-virtuoso', () => ({
    VirtuosoGrid: ({ data, itemContent }: { data: unknown[], itemContent: (index: number, item: unknown) => React.ReactNode }) => (
        <div data-testid="virtuoso-grid">
            {(data || []).map((item, index) => (
                <div key={index}>{itemContent(index, item)}</div>
            ))}
        </div>
    )
}));

// Mock icons
vi.mock('lucide-react', () => ({
    Users: () => <div data-testid="icon-users" />,
    Briefcase: () => <div data-testid="icon-briefcase" />,
    Calendar: () => <div data-testid="icon-calendar" />,
    Phone: () => <div data-testid="icon-phone" />,
    Trash2: () => <div data-testid="icon-trash" />,
    ArrowLeft: () => <div data-testid="icon-arrow-left" />,
    MoreVertical: () => <div data-testid="icon-more" />,
    CheckCircle2: () => <div data-testid="icon-check" />,
    Plus: () => <div data-testid="icon-plus" />,
    CalendarCheck: () => <div data-testid="icon-calendar-check" />,
    ArrowRight: () => <div data-testid="icon-arrow-right" />,
    User: () => <div data-testid="icon-user" />,
    XCircle: () => <div data-testid="icon-x-circle" />
}));

describe('MyTeam Page', () => {
    const mockEndEmployment = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useEndEmployment as any).mockReturnValue({
            mutateAsync: mockEndEmployment,
            isPending: false,
        });
    });

    it('should show a loading spinner when data is fetching', () => {
        (useMyTeam as any).mockReturnValue({
            isLoading: true,
            data: undefined,
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage: vi.fn(),
        });

        render(<MyTeamPage />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render an empty state when no team members exist', () => {
        (useMyTeam as any).mockReturnValue({
            isLoading: false,
            data: { pages: [{ team: [] }] },
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage: vi.fn(),
        });

        render(<MyTeamPage />);
        expect(screen.getByText(/No active team members/i)).toBeInTheDocument();
    });

    it('should render a list of team members', () => {
        const mockTeam = [
            { 
                _id: 'member1', 
                worker: { _id: 'worker1', name: 'John Doe', avatar: '', phone: '1234567890' },
                role: 'Supervisor',
                startDate: '2023-01-01'
            }
        ];

        (useMyTeam as any).mockReturnValue({
            isLoading: false,
            data: { pages: [{ team: mockTeam }] },
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage: vi.fn(),
        });

        render(<MyTeamPage />);
        
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Supervisor')).toBeInTheDocument();
        expect(screen.getByText(/Joined.*1 Jan 2023/i)).toBeInTheDocument();
    });

    it('should trigger end of employment when delete button is clicked', async () => {
        const mockTeam = [
            { 
                _id: 'member1', 
                worker: { _id: 'worker1', name: 'John Doe' },
                role: 'Worker',
                startDate: '2023-01-01'
            }
        ];

        (useMyTeam as any).mockReturnValue({
            isLoading: false,
            data: { pages: [{ team: mockTeam }] },
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage: vi.fn(),
        });

        vi.spyOn(window, 'confirm').mockReturnValue(true);

        render(<MyTeamPage />);
        
        // Open the menu first
        const moreBtn = screen.getByTitle(/More options/i);
        fireEvent.click(moreBtn);

        const deleteBtn = screen.getByText(/End Employment/i);
        fireEvent.click(deleteBtn);

        expect(mockEndEmployment).toHaveBeenCalledWith('member1');
    });
});
