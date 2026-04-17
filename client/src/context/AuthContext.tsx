"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';

export interface User {
    _id: string;
    name: string;
    email?: string;
    role: 'worker' | 'employer';
    avatar?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateUserData: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        const cached = localStorage.getItem('skillanchor_user_cache');
        if (cached) {
            try {
                setUser(JSON.parse(cached));
            } catch {
                // ignore parse error
            }
        }

        const restoreSession = async () => {
            try {
                const res = await authAPI.getMe();
                setUser(res.data.user);
                localStorage.setItem('skillanchor_user_cache', JSON.stringify(res.data.user));
            } catch {
                setUser(null);
                localStorage.removeItem('skillanchor_user_cache');
            } finally {
                setLoading(false);
            }
        };

        restoreSession();

        const handleUnauthorized = () => logout();
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('skillanchor_user_cache', JSON.stringify(newUser));
    };

    const updateUserData = (userData: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('skillanchor_user_cache', JSON.stringify(updatedUser));
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
            localStorage.removeItem('skillanchor_user_cache');
            queryClient.clear();
        }
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
