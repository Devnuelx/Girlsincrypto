'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Enrollment {
    id: string;
    course: {
        id: string;
        title: string;
        slug: string;
        description: string;
        tier: string;
    };
    startDate: string;
    progress?: number;
}

interface TierPurchase {
    tier: string;
    purchasedAt: string;
}

export default function LearnDashboard() {
    const { user, isAdmin } = useAuth();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [tiers, setTiers] = useState<TierPurchase[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [enrollmentsRes, tiersRes] = await Promise.all([
                fetch(`${API_URL}/enrollments/my`, { headers }),
                fetch(`${API_URL}/payments/my-tiers`, { headers }),
            ]);

            if (enrollmentsRes.ok) setEnrollments(await enrollmentsRes.json());
            if (tiersRes.ok) setTiers(await tiersRes.json());
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getHighestTier = () => {
        if (isAdmin) return 'ADMIN';
        if (Array.isArray(tiers) && tiers.some(t => t.tier === 'SOVEREIGN')) return 'SOVEREIGN';
        if (Array.isArray(tiers) && tiers.some(t => t.tier === 'EMPRESS')) return 'EMPRESS';
        if (Array.isArray(tiers) && tiers.some(t => t.tier === 'HEIRESS')) return 'HEIRESS';
        return null;
    };

    const highestTier = getHighestTier();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.firstName || 'Queen'} 👑
                </h1>
                <p className="text-gray-400">
                    Continue your journey to financial freedom.
                </p>
                {highestTier && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F2419C]/20 to-[#ff6bba]/20 rounded-full border border-pink-500/30">
                        <span>
                            {highestTier === 'SOVEREIGN' ? '🌟' : highestTier === 'EMPRESS' ? '💎' : highestTier === 'ADMIN' ? '⚡' : '👑'}
                        </span>
                        <span className="text-pink-400 font-medium">
                            {highestTier === 'ADMIN' ? 'Full Access' : `${highestTier} Member`}
                        </span>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <p className="text-gray-400 text-sm">Enrolled Courses</p>
                    <p className="text-3xl font-bold text-white mt-2">{enrollments.length}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-[#4ADE80] mt-2">
                        {enrollments.filter(e => (e.progress || 0) >= 100).length}
                    </p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <p className="text-gray-400 text-sm">In Progress</p>
                    <p className="text-3xl font-bold text-[#F2419C] mt-2">
                        {enrollments.filter(e => (e.progress || 0) < 100).length}
                    </p>
                </div>
            </div>

            {/* My Courses */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Continue Learning</h2>
                    <Link href="/learn/courses" className="text-sm text-[#F2419C] hover:underline">
                        View all →
                    </Link>
                </div>

                {enrollments.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrollments.slice(0, 3).map((enrollment) => (
                            <Link
                                key={enrollment.id}
                                href={`/learn/course/${enrollment.course.id}`}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${enrollment.course.tier === 'SOVEREIGN'
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : enrollment.course.tier === 'EMPRESS'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-pink-500/20 text-pink-400'
                                        }`}>
                                        {enrollment.course.tier}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#F2419C] transition">
                                    {enrollment.course.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                    {enrollment.course.description}
                                </p>
                                <div className="w-full h-2 bg-white/10 rounded-full">
                                    <div
                                        className="h-2 bg-gradient-to-r from-[#F2419C] to-[#ff6bba] rounded-full"
                                        style={{ width: `${enrollment.progress || 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{enrollment.progress || 0}% complete</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
                        <p className="text-gray-400 mb-4">You haven&apos;t enrolled in any courses yet.</p>
                        <Link
                            href="/courses"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-[#F2419C] to-[#ff6bba] text-white rounded-xl font-medium hover:opacity-90 transition"
                        >
                            Browse Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
