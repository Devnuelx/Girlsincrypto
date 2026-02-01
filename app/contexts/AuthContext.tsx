'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: 'ADMIN' | 'STUDENT';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ user: User; accessToken: string }>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        refreshUser();
    }, []);

    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Auth refresh failed:', error);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await res.json();
        localStorage.setItem('token', data.accessToken);
        setUser(data.user);
        return data;
    };

    const register = async (data: RegisterData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Registration failed');
        }

        const result = await res.json();
        localStorage.setItem('token', result.accessToken);
        setUser(result.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'ADMIN',
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
