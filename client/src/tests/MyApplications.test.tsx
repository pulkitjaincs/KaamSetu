import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyApplicationsPage from '@/app/(worker)/my-applications/page';
import { useApplications } from '@/hooks/queries/useApplications';
import React from 'react';

// Mock dependencies
vi.mock('@/hooks/queries/useApplications', () => ({
  useApplications: vi.fn(),
  useWithdrawApplication: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false }))
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('react-virtuoso', () => ({
  Virtuoso: ({ data, itemContent, components }: any) => (
    <div>
      {data.map((item: any, index: number) => (
        <div key={index}>{itemContent(index, item)}</div>
      ))}
      {components?.Footer && components.Footer()}
    </div>
  ),
}));

describe('MyApplicationsPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Bento grid stats correctly', () => {
    const mockData = {
      pages: [{
        applications: [
          { _id: '1', status: 'pending', appliedAt: new Date().toISOString(), job: { title: 'Job 1' } },
          { _id: '2', status: 'shortlisted', appliedAt: new Date().toISOString(), job: { title: 'Job 2' } },
          { _id: '3', status: 'hired', appliedAt: new Date().toISOString(), job: { title: 'Job 3' } },
        ]
      }]
    };

    (useApplications as any).mockReturnValue({
      data: mockData,
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn()
    });

    render(<MyApplicationsPage />);

    // Verify stats in Bento grid
    expect(screen.getByText('Total Applied')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // 3 total
    
    expect(screen.getAllByText('Shortlisted').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hired').length).toBeGreaterThan(0);
    
    // Check that we have at least two "1"s (one for shortlisted, one for hired)
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(2);
  });

  it('should show the pipeline stepper for each application', () => {
    const mockData = {
      pages: [{
        applications: [
          { _id: '1', status: 'reviewed', appliedAt: new Date().toISOString(), job: { title: 'Engineer' } }
        ]
      }]
    };

    (useApplications as any).mockReturnValue({
      data: mockData,
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn()
    });

    render(<MyApplicationsPage />);

    expect(screen.getByText('Engineer')).toBeInTheDocument();
    // Stepper labels - multiple instances exist because of Bento grid stats
    expect(screen.getAllByText('Applied').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Reviewed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Shortlisted').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hired').length).toBeGreaterThan(0);
  });
});
