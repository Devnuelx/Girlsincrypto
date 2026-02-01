'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, isAdmin, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            if (requireAdmin && !isAdmin) {
                // Redirect non-admins to student dashboard instead of /dashboard
                router.push('/student');
            }
        }
    }, [isAuthenticated, isAdmin, isLoading, requireAdmin, router, mounted]);

    // Show loading state
    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-[#2C2C2C] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-[#9B9B9B] text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - show nothing while redirecting
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#9B9B9B] text-sm">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Admin required but not admin
    if (requireAdmin && !isAdmin) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#9B9B9B] text-sm">Access denied. Redirecting...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
