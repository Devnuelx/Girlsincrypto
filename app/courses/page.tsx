'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { coursesApi, paymentsApi } from '../../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    tier: string;
    thumbnailUrl?: string;
    modules: Array<{ lessons: Array<any> }>;
    _count?: { enrollments: number };
    isCapped?: boolean;
    maxEnrollments?: number;
}

const TIER_INFO: Record<string, { label: string; emoji: string; color: string }> = {
    HEIRESS: { label: 'Heiress', emoji: '👑', color: 'bg-pink-100 text-pink-700' },
    EMPRESS: { label: 'Empress', emoji: '💎', color: 'bg-purple-100 text-purple-700' },
    SOVEREIGN: { label: 'Sovereign', emoji: '🌟', color: 'bg-amber-100 text-amber-700' },
};

export default function CoursesPage() {
    const { isAuthenticated } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [userTiers, setUserTiers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            const coursesData = await coursesApi.getAll(true);
            setCourses(coursesData);

            if (isAuthenticated) {
                const tierData = await paymentsApi.getMyTiers();
                setUserTiers(tierData.accessibleTiers || []);
            }
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const hasAccess = (tier: string) => userTiers.includes(tier);

    const getTotalLessons = (course: Course) => {
        return course.modules?.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0) || 0;
    };

    const filteredCourses = filter
        ? courses.filter(c => c.tier === filter)
        : courses;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fcfdf2] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdf2]">
            {/* Header */}
            <header className="bg-white border-b border-pink-100">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">💕</span>
                        <span className="font-bold text-[#F2419C] font-space">GICH</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/pricing" className="text-gray-600 hover:text-[#F2419C]">Pricing</Link>
                        {isAuthenticated ? (
                            <Link href="/dashboard" className="px-4 py-2 bg-[#F2419C] text-white rounded-full font-medium hover:bg-pink-500">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/login" className="px-4 py-2 bg-[#F2419C] text-white rounded-full font-medium hover:bg-pink-500">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 font-space mb-4">
                        Course Catalog 📚
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Master crypto with our expertly crafted courses. Each lesson unlocks on your schedule.
                    </p>
                </div>

                {/* Tier Filter */}
                <div className="flex justify-center gap-3 mb-8">
                    <button
                        onClick={() => setFilter(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${!filter ? 'bg-[#F2419C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All Courses
                    </button>
                    {Object.entries(TIER_INFO).map(([tier, info]) => (
                        <button
                            key={tier}
                            onClick={() => setFilter(tier)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === tier ? 'bg-[#F2419C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {info.emoji} {info.label}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => {
                        const tierInfo = TIER_INFO[course.tier] || TIER_INFO.HEIRESS;
                        const canAccess = hasAccess(course.tier);
                        const lessonCount = getTotalLessons(course);
                        const isFull = course.isCapped && course.maxEnrollments &&
                            course._count?.enrollments && course._count.enrollments >= course.maxEnrollments;

                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-2xl border border-pink-100 overflow-hidden hover:shadow-xl transition group"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gradient-to-br from-[#F2419C] to-[#ff6bba] flex items-center justify-center relative">
                                    <span className="text-5xl">{tierInfo.emoji}</span>
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${tierInfo.color}`}>
                                            {tierInfo.label}
                                        </span>
                                    </div>
                                    {isFull && (
                                        <div className="absolute bottom-3 left-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                Enrollment Full
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#F2419C] transition">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                        {course.description || 'Master the fundamentals of this exciting topic.'}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span>📖 {course.modules?.length || 0} modules</span>
                                        <span>🎬 {lessonCount} lessons</span>
                                    </div>

                                    {/* CTA */}
                                    {canAccess ? (
                                        <Link
                                            href={`/courses/${course.slug}`}
                                            className="block w-full py-3 bg-[#F2419C] text-white text-center rounded-xl font-semibold hover:bg-pink-500 transition"
                                        >
                                            Start Learning
                                        </Link>
                                    ) : isFull ? (
                                        <button
                                            disabled
                                            className="block w-full py-3 bg-gray-200 text-gray-500 text-center rounded-xl font-semibold cursor-not-allowed"
                                        >
                                            Enrollment Closed
                                        </button>
                                    ) : (
                                        <Link
                                            href="/pricing"
                                            className="block w-full py-3 border-2 border-[#F2419C] text-[#F2419C] text-center rounded-xl font-semibold hover:bg-pink-50 transition"
                                        >
                                            Unlock with {tierInfo.label}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
                        <span className="text-4xl mb-4 block">📭</span>
                        <p className="text-gray-600">No courses found in this category.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
