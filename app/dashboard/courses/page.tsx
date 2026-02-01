'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { enrollmentsApi, coursesApi } from '../../../lib/api';

interface Enrollment {
    id: string;
    course: {
        id: string;
        title: string;
        slug: string;
        description: string;
    };
    lessonUnlocks: Array<{
        unlockAt: string;
        isUnlocked: boolean;
    }>;
}

interface PublicCourse {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number | null;
    accessType: string;
}

export default function MyCoursesPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [availableCourses, setAvailableCourses] = useState<PublicCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [enrollmentsData, coursesData] = await Promise.all([
                enrollmentsApi.getMy(),
                coursesApi.getAll(true),
            ]);
            setEnrollments(enrollmentsData);

            // Filter out courses user is already enrolled in
            const enrolledCourseIds = new Set(enrollmentsData.map((e: Enrollment) => e.course.id));
            setAvailableCourses(coursesData.filter((c: PublicCourse) => !enrolledCourseIds.has(c.id)));
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getProgress = (enrollment: Enrollment) => {
        const total = enrollment.lessonUnlocks.length;
        const unlocked = enrollment.lessonUnlocks.filter(u => u.isUnlocked).length;
        return { total, unlocked, percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0 };
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-space">My Courses</h1>
                <p className="mt-2 text-gray-600">Track your learning progress</p>
            </div>

            {/* Enrolled Courses */}
            {enrollments.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Enrolled Courses</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {enrollments.map((enrollment) => {
                            const progress = getProgress(enrollment);
                            return (
                                <Link
                                    key={enrollment.id}
                                    href={`/dashboard/courses/${enrollment.course.id}`}
                                    className="bg-white rounded-2xl border border-pink-100 overflow-hidden hover:shadow-lg transition group"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-[#F2419C] to-[#ff6bba] flex items-center justify-center">
                                        <span className="text-4xl">📚</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-[#F2419C] transition">
                                            {enrollment.course.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {enrollment.course.description}
                                        </p>

                                        <div className="mt-3">
                                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                                <span>{progress.unlocked} / {progress.total} unlocked</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-[#F2419C] rounded-full h-2 transition-all"
                                                    style={{ width: `${progress.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Available Courses */}
            {availableCourses.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Available Courses</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {availableCourses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                            >
                                <div className="aspect-video bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                    <span className="text-4xl opacity-50">📚</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {course.price ? `$${course.price}` : 'Free with subscription'}
                                        </span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {course.accessType}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/courses/${course.slug}`}
                                        className="mt-3 block text-center py-2 border border-[#F2419C] text-[#F2419C] rounded-lg font-medium hover:bg-pink-50 transition"
                                    >
                                        View Course
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {enrollments.length === 0 && availableCourses.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
                    <span className="text-4xl mb-4 block">📚</span>
                    <p className="text-gray-600 mb-4">No courses available yet.</p>
                    <p className="text-gray-500 text-sm">Check back soon for new content!</p>
                </div>
            )}
        </div>
    );
}
