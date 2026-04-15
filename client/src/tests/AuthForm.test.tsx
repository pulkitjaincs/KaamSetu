import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import { useLogin } from '@/hooks/ui/useLogin';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock the hooks and Next.js navigation
vi.mock('@/hooks/ui/useLogin');
vi.mock('@/context/AuthContext', () => ({
    useAuth: vi.fn()
}));
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    useSearchParams: () => ({ get: () => '/' }),
}));

describe('Auth Form (Login Page)', () => {
    const mockUseLogin = useLogin as Mock;
    const mockUseAuth = useAuth as Mock;
    const mockPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({ user: null });
        (useRouter as Mock).mockReturnValue({ push: mockPush });
    });

    it('should redirect if user is already logged in', () => {
        mockUseAuth.mockReturnValue({ user: { id: '1' } });
        mockUseLogin.mockReturnValue({
            redirect: '/dashboard',
            router: { push: mockPush },
            loginMethod: 'phone',
            loading: false,
            getButtonText: () => 'Send OTP',
            resetState: vi.fn()
        });

        render(<LoginPage />);
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should render the login form initially', () => {
        mockUseLogin.mockReturnValue({
            loginMethod: 'phone',
            otpSent: false,
            phone: '',
            loading: false,
            resetState: vi.fn(),
            getButtonText: () => 'Send OTP',
            handleLogin: vi.fn(),
        });

        render(<LoginPage />);
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send otp/i })).not.toBeDisabled();
    });

    it('should show loading state and disable button when authenticating', () => {
        mockUseLogin.mockReturnValue({
            loginMethod: 'phone',
            otpSent: false,
            phone: '1234567890',
            loading: true,
            resetState: vi.fn(),
            getButtonText: () => 'Send OTP',
            handleLogin: vi.fn(),
        });

        render(<LoginPage />);
        
        const submitBtn = screen.getByRole('button', { name: /please wait/i });
        expect(submitBtn).toBeInTheDocument();
        expect(submitBtn).toBeDisabled();
    });

    it('should show email fields when switching method', () => {
        mockUseLogin.mockReturnValue({
            loginMethod: 'email',
            emailMethod: 'password',
            otpSent: false,
            email: '',
            password: '',
            loading: false,
            resetState: vi.fn(),
            getButtonText: () => 'Sign In',
            handleLogin: vi.fn(),
        });

        render(<LoginPage />);
        expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    });

    it('should interact with the phone login method and phone input', () => {
        const setLoginMethod = vi.fn();
        const setPhone = vi.fn();
        const resetState = vi.fn();
        mockUseLogin.mockReturnValue({
            loginMethod: 'email',
            otpSent: false,
            phone: '',
            loading: false,
            setLoginMethod,
            setPhone,
            resetState,
            getButtonText: () => 'Send OTP',
            handleLogin: vi.fn(),
        });

        render(<LoginPage />);
        
        const phoneButton = screen.getByRole('button', { name: /phone/i });
        fireEvent.click(phoneButton);
        expect(setLoginMethod).toHaveBeenCalledWith('phone');
        expect(resetState).toHaveBeenCalled();
    });

    it('should type into phone and trigger setPhone', () => {
        const setPhone = vi.fn();
        mockUseLogin.mockReturnValue({
            loginMethod: 'phone',
            otpSent: false,
            phone: '',
            loading: false,
            setPhone,
            resetState: vi.fn(),
            getButtonText: () => 'Send OTP',
            handleLogin: vi.fn(),
        });

        render(<LoginPage />);
        
        const phoneInput = screen.getByPlaceholderText(/phone number/i);
        fireEvent.change(phoneInput, { target: { value: '123abc4567' } });
        expect(setPhone).toHaveBeenCalledWith('1234567');
    });

    it('should render new user fields for phone OTP and handle interactions', () => {
        const setName = vi.fn();
        const setRole = vi.fn();
        const setOtp = vi.fn();
        const resetState = vi.fn();
        mockUseLogin.mockReturnValue({
            loginMethod: 'phone',
            otpSent: true,
            isNewUser: true,
            phone: '1234567890',
            otp: '',
            name: '',
            role: 'worker',
            loading: false,
            setName,
            setRole,
            setOtp,
            resetState,
            getButtonText: () => 'Verify OTP',
            handleLogin: vi.fn(),
        });

        render(<LoginPage />);
        expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
        
        fireEvent.change(screen.getByPlaceholderText(/john doe/i), { target: { value: 'Jane' } });
        expect(setName).toHaveBeenCalledWith('Jane');

        const roleSelect = screen.getByRole('combobox');
        fireEvent.change(roleSelect, { target: { value: 'employer' } });
        expect(setRole).toHaveBeenCalledWith('employer');

        const otpInput = screen.getByPlaceholderText(/6-digit OTP/i);
        fireEvent.change(otpInput, { target: { value: '123abc45' } });
        expect(setOtp).toHaveBeenCalledWith('12345');

        fireEvent.click(screen.getByRole('button', { name: /change number/i }));
        expect(resetState).toHaveBeenCalled();
    });

    it('should handle email login methods and inputs', () => {
        const setEmailMethod = vi.fn();
        const setOtp = vi.fn();
        const setPassword = vi.fn();
        const setEmail = vi.fn();
        const setLoginMethod = vi.fn();
        const resetState = vi.fn();

        mockUseLogin.mockReturnValue({
            loginMethod: 'phone',
            emailMethod: 'password',
            otpSent: false,
            phone: '',
            email: '',
            password: '',
            loading: false,
            setLoginMethod,
            setEmailMethod,
            setOtp,
            setPassword,
            setEmail,
            resetState,
            getButtonText: () => 'Sign In',
            handleLogin: vi.fn(),
        });

        const { rerender } = render(<LoginPage />);
        fireEvent.click(screen.getByRole('button', { name: /email/i }));
        expect(setLoginMethod).toHaveBeenCalledWith('email');
        expect(resetState).toHaveBeenCalled();

        mockUseLogin.mockReturnValue({
            loginMethod: 'email',
            emailMethod: 'password',
            otpSent: false,
            email: '',
            password: '',
            loading: false,
            setLoginMethod,
            setEmailMethod,
            setOtp,
            setPassword,
            setEmail,
            resetState,
            getButtonText: () => 'Sign In',
            handleLogin: vi.fn(),
        });
        rerender(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: 'test@example.com' } });
        expect(setEmail).toHaveBeenCalledWith('test@example.com');

        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'pass123' } });
        expect(setPassword).toHaveBeenCalledWith('pass123');

        fireEvent.click(screen.getByRole('button', { name: /otp/i }));
        expect(setEmailMethod).toHaveBeenCalledWith('otp');
        expect(setPassword).toHaveBeenCalledWith('');

        mockUseLogin.mockReturnValue({
            loginMethod: 'email',
            emailMethod: 'otp',
            otpSent: false,
            email: '',
            password: '',
            loading: false,
            setEmailMethod,
            setOtp,
            setPassword,
            getButtonText: () => 'Sign In',
            handleLogin: vi.fn(),
        });
        rerender(<LoginPage />);
        
        fireEvent.click(screen.getByRole('button', { name: /password/i }));
        expect(setEmailMethod).toHaveBeenCalledWith('password');
        expect(setOtp).toHaveBeenCalledWith('');
    });

    it('should render new user fields for email OTP and handle interactions', () => {
        const setName = vi.fn();
        const setRole = vi.fn();
        const setOtp = vi.fn();
        const resetState = vi.fn();
        const handleLogin = vi.fn((e) => e.preventDefault());

        mockUseLogin.mockReturnValue({
            loginMethod: 'email',
            emailMethod: 'otp',
            otpSent: true,
            isNewUser: true,
            email: 'test@example.com',
            otp: '',
            name: '',
            role: 'worker',
            loading: false,
            setName,
            setRole,
            setOtp,
            resetState,
            getButtonText: () => 'Verify OTP',
            handleLogin,
        });

        const { rerender } = render(<LoginPage />);
        expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
        
        fireEvent.change(screen.getByPlaceholderText(/john doe/i), { target: { value: 'Jane' } });
        expect(setName).toHaveBeenCalledWith('Jane');

        const roleSelect = screen.getByRole('combobox');
        fireEvent.change(roleSelect, { target: { value: 'employer' } });
        expect(setRole).toHaveBeenCalledWith('employer');

        const otpInput = screen.getByPlaceholderText(/6-digit OTP/i);
        fireEvent.change(otpInput, { target: { value: '123abc45' } });
        expect(setOtp).toHaveBeenCalledWith('12345');

        fireEvent.click(screen.getByRole('button', { name: /change email/i }));
        expect(resetState).toHaveBeenCalled();

        // Handle error rendering
        mockUseLogin.mockReturnValue({
            loginMethod: 'email',
            emailMethod: 'otp',
            otpSent: true,
            isNewUser: true,
            email: 'test@example.com',
            error: 'Invalid OTP',
            otp: '',
            name: '',
            role: 'worker',
            loading: false,
            getButtonText: () => 'Verify OTP',
            handleLogin,
        });
        
        rerender(<LoginPage />);
        expect(screen.getByText('Invalid OTP')).toBeInTheDocument();

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /verify otp/i }));
        expect(handleLogin).toHaveBeenCalled();
    });
});
