'use client';

import { useEffect, useState } from 'react';
import { analyticsApi } from '../../../lib/api';

interface DashboardStats {
    users: { total: number; active: number };
    courses: { total: number; published: number };
    enrollments: { total: number; recent: number };
    tiers: { HEIRESS: number; EMPRESS: number; SOVEREIGN: number };
}

interface RevenueStats {
    total: number;
    last30Days: number;
    byTier: { HEIRESS: number; EMPRESS: number; SOVEREIGN: number };
    purchaseCount: number;
}

interface TrendItem {
    date: string;
    count: number;
}

interface TopCourse {
    id: string;
    title: string;
    tier: string;
    enrollments: number;
}

const TIER_COLORS: Record<string, string> = {
    HEIRESS: 'bg-pink-500',
    EMPRESS: 'bg-purple-500',
    SOVEREIGN: 'bg-amber-500',
};

export default function AnalyticsPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenue, setRevenue] = useState<RevenueStats | null>(null);
    const [trend, setTrend] = useState<TrendItem[]>([]);
    const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const [dashboardData, revenueData, trendData, coursesData] = await Promise.all([
                analyticsApi.getDashboard(),
                analyticsApi.getRevenue(),
                analyticsApi.getEnrollmentTrend(),
                analyticsApi.getTopCourses(),
            ]);
            setStats(dashboardData);
            setRevenue(revenueData);
            setTrend(trendData);
            setTopCourses(coursesData);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const maxTrendCount = Math.max(...trend.map(t => t.count), 1);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white font-space">Analytics</h1>
                <p className="mt-2 text-gray-400">Platform performance overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats?.users.total || 0}</p>
                    <p className="text-green-400 text-sm mt-1">{stats?.users.active || 0} active</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Published Courses</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats?.courses.published || 0}</p>
                    <p className="text-gray-500 text-sm mt-1">of {stats?.courses.total || 0} total</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Enrollments</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats?.enrollments.total || 0}</p>
                    <p className="text-[#F2419C] text-sm mt-1">+{stats?.enrollments.recent || 0} this week</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-white mt-2">${revenue?.total?.toFixed(2) || '0.00'}</p>
                    <p className="text-green-400 text-sm mt-1">${revenue?.last30Days?.toFixed(2) || '0.00'} last 30d</p>
                </div>
            </div>

            {/* Tier Distribution & Revenue */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Tier Purchases */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h2 className="text-lg font-bold text-white mb-4">Tier Purchases</h2>
                    <div className="space-y-4">
                        {(['HEIRESS', 'EMPRESS', 'SOVEREIGN'] as const).map(tier => {
                            const count = stats?.tiers[tier] || 0;
                            const tierRevenue = revenue?.byTier[tier] || 0;
                            const total = Object.values(stats?.tiers || {}).reduce((a, b) => a + b, 0) || 1;
                            const percentage = Math.round((count / total) * 100);

                            return (
                                <div key={tier}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-300 flex items-center gap-2">
                                            <span>{tier === 'HEIRESS' ? '👑' : tier === 'EMPRESS' ? '💎' : '🌟'}</span>
                                            {tier}
                                        </span>
                                        <span className="text-white font-medium">{count} purchases</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                                            <div
                                                className={`${TIER_COLORS[tier]} rounded-full h-3 transition-all`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-gray-400 text-sm w-20 text-right">
                                            ${tierRevenue.toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h2 className="text-lg font-bold text-white mb-4">Top Courses</h2>
                    {topCourses.length === 0 ? (
                        <p className="text-gray-500">No courses with enrollments yet</p>
                    ) : (
                        <div className="space-y-3">
                            {topCourses.map((course, index) => (
                                <div key={course.id} className="flex items-center gap-3">
                                    <span className="text-gray-500 w-6">{index + 1}.</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white truncate">{course.title}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded ${course.tier === 'SOVEREIGN' ? 'bg-amber-500/20 text-amber-400' :
                                                course.tier === 'EMPRESS' ? 'bg-purple-500/20 text-purple-400' :
                                                    'bg-pink-500/20 text-pink-400'
                                            }`}>
                                            {course.tier}
                                        </span>
                                    </div>
                                    <span className="text-gray-400">{course.enrollments}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Enrollment Trend */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-lg font-bold text-white mb-4">Enrollment Trend (14 days)</h2>
                <div className="flex items-end gap-1 h-40">
                    {trend.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-[#F2419C] rounded-t transition-all"
                                style={{ height: `${(item.count / maxTrendCount) * 100}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                            ></div>
                            <span className="text-gray-500 text-xs mt-2 transform -rotate-45 origin-top-left">
                                {item.date.slice(5)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
