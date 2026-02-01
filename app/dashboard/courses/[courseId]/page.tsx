'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { enrollmentsApi } from '../../../../lib/api';

interface Enrollment {
    id: string;
    preferredDays: string[];
    course: {
        id: string;
        title: string;
        description: string;
        modules: Module[];
    };
    lessonUnlocks: LessonUnlock[];
    accessInfo: {
        accessibleLessonIds: string[];
        upcomingUnlocks: Array<{ lessonId: string; unlockAt: string }>;
    };
    progress: {
        completed: number;
        total: number;
        percentage: number;
    };
}

interface Module {
    id: string;
    title: string;
    orderIndex: number;
    lessons: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
    description: string;
    contentType: string;
    durationMinutes: number | null;
    orderIndex: number;
}

interface LessonUnlock {
    lessonId: string;
    unlockAt: string;
    isUnlocked: boolean;
}

export default function StudentCoursePage() {
    const params = useParams();
    const courseId = params.courseId as string;

    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState<string | null>(null);

    useEffect(() => {
        loadEnrollment();
    }, [courseId]);

    const loadEnrollment = async () => {
        try {
            const data = await enrollmentsApi.getMyForCourse(courseId);
            setEnrollment(data);
        } catch (error) {
            console.error('Failed to load enrollment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isLessonAccessible = (lessonId: string) => {
        return enrollment?.accessInfo?.accessibleLessonIds?.includes(lessonId) || false;
    };

    const getUnlockDate = (lessonId: string) => {
        const unlock = enrollment?.lessonUnlocks?.find(u => u.lessonId === lessonId);
        return unlock?.unlockAt ? new Date(unlock.unlockAt) : null;
    };

    const formatCountdown = (unlockAt: Date) => {
        const now = new Date();
        const diff = unlockAt.getTime() - now.getTime();

        if (diff <= 0) return 'Unlocking...';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h`;
        return 'Soon';
    };

    const handleMarkComplete = async (lessonId: string) => {
        try {
            await enrollmentsApi.markComplete(lessonId);
            loadEnrollment();
        } catch (error) {
            console.error('Failed to mark complete:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You are not enrolled in this course.</p>
                <Link href="/courses" className="text-[#F2419C] hover:underline">
                    Browse Courses
                </Link>
            </div>
        );
    }

    const currentLesson = enrollment.course.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === activeLesson);

    return (
        <div className="space-y-6">
            {/* Course Header */}
            <div className="bg-gradient-to-r from-[#F2419C] to-[#ff6bba] rounded-2xl p-6 text-white">
                <Link href="/dashboard/courses" className="text-white/80 hover:text-white text-sm mb-2 inline-block">
                    ← Back to My Courses
                </Link>
                <h1 className="text-2xl font-bold font-space">{enrollment.course.title}</h1>
                <p className="text-white/80 mt-2">{enrollment.course.description}</p>

                {/* Progress */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Progress: {enrollment.progress.completed}/{enrollment.progress.total} lessons</span>
                        <span>{enrollment.progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                            className="bg-white rounded-full h-2 transition-all"
                            style={{ width: `${enrollment.progress.percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Preferred Days */}
            <div className="bg-white rounded-xl border border-pink-100 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-gray-600 text-sm">Your learning days:</span>
                        <span className="ml-2 font-medium">
                            {enrollment.preferredDays?.join(', ') || 'Not set'}
                        </span>
                    </div>
                    <Link
                        href={`/dashboard/courses/${courseId}/preferences`}
                        className="text-[#F2419C] text-sm hover:underline"
                    >
                        Edit Days
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Modules & Lessons Sidebar */}
                <div className="col-span-1 space-y-4">
                    {enrollment.course.modules.map((module, moduleIndex) => (
                        <div key={module.id} className="bg-white rounded-xl border border-pink-100 overflow-hidden">
                            <div className="px-4 py-3 bg-pink-50 border-b border-pink-100">
                                <h3 className="font-semibold text-gray-900">
                                    Module {moduleIndex + 1}: {module.title}
                                </h3>
                            </div>
                            <div className="divide-y divide-pink-50">
                                {module.lessons.map((lesson, lessonIndex) => {
                                    const accessible = isLessonAccessible(lesson.id);
                                    const unlockDate = getUnlockDate(lesson.id);
                                    const isActive = activeLesson === lesson.id;

                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => accessible && setActiveLesson(lesson.id)}
                                            disabled={!accessible}
                                            className={`w-full text-left px-4 py-3 transition ${isActive
                                                    ? 'bg-[#fff0f7] border-l-4 border-[#F2419C]'
                                                    : accessible
                                                        ? 'hover:bg-gray-50'
                                                        : 'opacity-60 cursor-not-allowed bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400 text-sm">{lessonIndex + 1}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium truncate ${accessible ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {lesson.title}
                                                    </p>
                                                    {!accessible && unlockDate && (
                                                        <p className="text-xs text-[#F2419C] mt-0.5">
                                                            🔒 Unlocks in {formatCountdown(unlockDate)}
                                                        </p>
                                                    )}
                                                </div>
                                                {accessible && (
                                                    <span className="text-green-500 text-lg">✓</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lesson Content */}
                <div className="col-span-2">
                    {activeLesson && currentLesson ? (
                        <div className="bg-white rounded-xl border border-pink-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
                            {currentLesson.description && (
                                <p className="text-gray-600 mb-4">{currentLesson.description}</p>
                            )}

                            {/* Placeholder for video/content */}
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                                <div className="text-center">
                                    <span className="text-4xl mb-2 block">
                                        {currentLesson.contentType === 'VIDEO' ? '🎬' :
                                            currentLesson.contentType === 'TEXT' ? '📝' :
                                                currentLesson.contentType === 'PDF' ? '📄' : '❓'}
                                    </span>
                                    <p className="text-gray-500">
                                        {currentLesson.contentType} content
                                        {currentLesson.durationMinutes && ` • ${currentLesson.durationMinutes} min`}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleMarkComplete(currentLesson.id)}
                                className="w-full py-3 bg-[#F2419C] text-white rounded-lg font-semibold hover:bg-pink-500 transition"
                            >
                                Mark as Complete ✓
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-pink-100 p-12 text-center">
                            <span className="text-4xl mb-4 block">📚</span>
                            <p className="text-gray-600">Select a lesson to start learning</p>
                        </div>
                    )}

                    {/* Upcoming Unlocks */}
                    {enrollment.accessInfo?.upcomingUnlocks?.length > 0 && (
                        <div className="mt-6 bg-white rounded-xl border border-pink-100 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">🔐 Upcoming Unlocks</h3>
                            <div className="space-y-2">
                                {enrollment.accessInfo.upcomingUnlocks.slice(0, 3).map((unlock) => {
                                    const lesson = enrollment.course.modules
                                        .flatMap(m => m.lessons)
                                        .find(l => l.id === unlock.lessonId);
                                    return (
                                        <div key={unlock.lessonId} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">{lesson?.title}</span>
                                            <span className="text-[#F2419C] font-medium">
                                                {new Date(unlock.unlockAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
