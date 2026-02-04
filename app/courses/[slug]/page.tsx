'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { coursesApi, enrollmentsApi, paymentsApi } from '../../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    tier: string;
    minDurationWeeks: number;
    allowDayChoice: boolean;
    modules: Module[];
}

interface Module {
    id: string;
    title: string;
    description?: string;
    orderIndex: number;
    lessons: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
    contentType: string;
    durationMinutes?: number;
    isPreviewable: boolean;
}

const TIER_INFO: Record<string, { label: string; emoji: string; color: string }> = {
    HEIRESS: { label: 'Heiress', emoji: '👑', color: 'bg-pink-100 text-pink-700' },
    EMPRESS: { label: 'Empress', emoji: '💎', color: 'bg-purple-100 text-purple-700' },
    SOVEREIGN: { label: 'Sovereign', emoji: '🌟', color: 'bg-amber-100 text-amber-700' },
};

const DAYS = [
    { value: 'MON', label: 'Mon' },
    { value: 'TUE', label: 'Tue' },
    { value: 'WED', label: 'Wed' },
    { value: 'THU', label: 'Thu' },
    { value: 'FRI', label: 'Fri' },
    { value: 'SAT', label: 'Sat' },
    { value: 'SUN', label: 'Sun' },
];

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [userTiers, setUserTiers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>(['MON', 'WED', 'FRI']);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        loadData();
    }, [slug, isAuthenticated]);

    const loadData = async () => {
        try {
            const courseData = await coursesApi.getBySlug(slug);
            setCourse(courseData);

            if (isAuthenticated) {
                const [tierData, enrollment] = await Promise.all([
                    paymentsApi.getMyTiers(),
                    enrollmentsApi.getMyForCourse(courseData.id).catch(() => null),
                ]);
                setUserTiers(tierData.accessibleTiers || []);
                setIsEnrolled(!!enrollment);
            }
        } catch (error) {
            console.error('Failed to load course:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const hasAccess = course ? userTiers.includes(course.tier) : false;

    const handleEnroll = async () => {
        if (!course) return;
        setEnrolling(true);
        try {
            await enrollmentsApi.enroll(course.id, selectedDays);
            router.push(`/dashboard/courses/${course.id}`);
        } catch (error) {
            console.error('Enrollment failed:', error);
            alert((error as Error).message);
        } finally {
            setEnrolling(false);
        }
    };

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const getTotalLessons = () => {
        return course?.modules?.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0) || 0;
    };

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen bg-[#fcfdf2] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#fcfdf2] flex items-center justify-center">
                <div className="text-center">
                    <span className="text-4xl mb-4 block">😢</span>
                    <p className="text-gray-600">Course not found</p>
                    <Link href="/courses" className="text-[#F2419C] hover:underline mt-4 inline-block">
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    const tierInfo = TIER_INFO[course.tier] || TIER_INFO.HEIRESS;

    return (
        <div className="min-h-screen bg-[#fcfdf2]">
            {/* Header */}
            <header className="bg-white border-b border-pink-100">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/courses" className="text-gray-600 hover:text-[#F2419C]">
                        ← All Courses
                    </Link>
                    {isAuthenticated ? (
                        <Link href="/dashboard" className="text-[#F2419C] font-medium">Dashboard</Link>
                    ) : (
                        <Link href="/login" className="text-[#F2419C] font-medium">Sign In</Link>
                    )}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-[#F2419C] to-[#ff6bba] rounded-3xl p-8 text-white mb-8">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${tierInfo.color} mb-4`}>
                        {tierInfo.emoji} {tierInfo.label} Tier
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold font-space mb-4">{course.title}</h1>
                    <p className="text-white/90 text-lg">{course.description}</p>

                    <div className="flex flex-wrap gap-6 mt-6 text-sm">
                        <div>
                            <span className="opacity-70">Modules</span>
                            <span className="block text-lg font-bold">{course.modules?.length || 0}</span>
                        </div>
                        <div>
                            <span className="opacity-70">Lessons</span>
                            <span className="block text-lg font-bold">{getTotalLessons()}</span>
                        </div>
                        <div>
                            <span className="opacity-70">Duration</span>
                            <span className="block text-lg font-bold">{course.minDurationWeeks}+ weeks</span>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="bg-white rounded-2xl border border-pink-100 p-6 mb-8">
                    {isEnrolled ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-green-600 font-semibold">✓ You&apos;re enrolled!</span>
                                <p className="text-gray-500 text-sm mt-1">Continue where you left off</p>
                            </div>
                            <Link
                                href={`/dashboard/courses/${course.id}`}
                                className="px-6 py-3 bg-[#F2419C] text-white rounded-xl font-semibold hover:bg-pink-500"
                            >
                                Continue Learning
                            </Link>
                        </div>
                    ) : hasAccess ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-gray-900 font-semibold">Ready to start?</span>
                                <p className="text-gray-500 text-sm mt-1">Your {tierInfo.label} tier gives you access</p>
                            </div>
                            <button
                                onClick={() => setShowEnrollModal(true)}
                                className="px-6 py-3 bg-[#F2419C] text-white rounded-xl font-semibold hover:bg-pink-500"
                            >
                                Enroll Now
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-gray-900 font-semibold">Unlock this course</span>
                                <p className="text-gray-500 text-sm mt-1">Requires {tierInfo.label} tier or higher</p>
                            </div>
                            <Link
                                href="/pricing"
                                className="px-6 py-3 bg-[#F2419C] text-white rounded-xl font-semibold hover:bg-pink-500"
                            >
                                Get {tierInfo.label}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Course Curriculum */}
                <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-pink-100">
                        <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
                    </div>

                    {course.modules?.map((module, moduleIndex) => (
                        <div key={module.id} className="border-b border-pink-50 last:border-0">
                            <div className="px-6 py-4 bg-pink-50/50">
                                <h3 className="font-semibold text-gray-900">
                                    Module {moduleIndex + 1}: {module.title}
                                </h3>
                                {module.description && (
                                    <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                                )}
                            </div>
                            <div className="divide-y divide-pink-50">
                                {module.lessons?.map((lesson, lessonIndex) => (
                                    <div key={lesson.id} className="px-6 py-3 flex items-center gap-4">
                                        <span className="text-gray-400 text-sm w-6">{lessonIndex + 1}</span>
                                        <span className="text-xl">
                                            {lesson.contentType === 'VIDEO' ? '🎬' :
                                                lesson.contentType === 'TEXT' ? '📝' :
                                                    lesson.contentType === 'PDF' ? '📄' : '❓'}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-gray-700">{lesson.title}</p>
                                            {lesson.durationMinutes && (
                                                <span className="text-xs text-gray-400">{lesson.durationMinutes} min</span>
                                            )}
                                        </div>
                                        {!hasAccess && !isEnrolled && (
                                            <span className="text-gray-400">🔒</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Enrollment Modal */}
            {showEnrollModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Learning Days</h2>
                        <p className="text-gray-600 mb-6">
                            Lessons will unlock on these days throughout your {course.minDurationWeeks}+ week journey.
                        </p>

                        <div className="grid grid-cols-7 gap-2 mb-6">
                            {DAYS.map(day => (
                                <button
                                    key={day.value}
                                    onClick={() => toggleDay(day.value)}
                                    className={`py-3 rounded-xl text-sm font-medium transition ${selectedDays.includes(day.value)
                                            ? 'bg-[#F2419C] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>

                        {selectedDays.length === 0 && (
                            <p className="text-red-500 text-sm mb-4">Please select at least one day</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEnrollModal(false)}
                                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEnroll}
                                disabled={selectedDays.length === 0 || enrolling}
                                className="flex-1 py-3 bg-[#F2419C] text-white rounded-xl font-semibold hover:bg-pink-500 disabled:opacity-50"
                            >
                                {enrolling ? 'Enrolling...' : 'Start Learning'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
