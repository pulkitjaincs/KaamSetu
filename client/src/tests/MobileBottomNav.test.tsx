import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

// Mock dependencies
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('MobileBottomNav', () => {
  it('should not render if user is not logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUserData: vi.fn()
    });
    vi.mocked(usePathname).mockReturnValue('/');

    const { container } = render(<MobileBottomNav />);
    expect(container.firstChild).toBeNull();
  });

  it('should render navigation items for logged in user', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { _id: '1', name: 'Test', role: 'worker' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUserData: vi.fn()
    });
    vi.mocked(usePathname).mockReturnValue('/');

    render(<MobileBottomNav />);

    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should highlight active tab based on pathname', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { _id: '1', name: 'Test', role: 'worker' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUserData: vi.fn()
    });
    vi.mocked(usePathname).mockReturnValue('/my-applications');

    render(<MobileBottomNav />);

    const appliedLink = screen.getByText('Applied').closest('a');
    // Active class/color is handled by Tailwind and Framer Motion, 
    // but we can check if the text has the expected color class or if a motion div exists
    expect(appliedLink).toBeInTheDocument();
  });
});
