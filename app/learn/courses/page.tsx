'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    tier: string;
    modules?: Array<{ id: string; title: string; lessons: any[] }>;
}

interface Enrollment {
    id: string;
    courseId: string;
    course: Course;
    progress?: number;
}

export default function MyCoursesPage() {
    const { isAdmin } = useAuth();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // Get enrolled courses
            const enrollmentsRes = await fetch(`${API_URL}/enrollments/my`, { headers });
            if (enrollmentsRes.ok) {
                setEnrollments(await enrollmentsRes.json());
            }

            // If admin, also get all courses
            if (isAdmin) {
                const coursesRes = await fetch(`${API_URL}/courses`, { headers });
                if (coursesRes.ok) {
                    setAllCourses(await coursesRes.json());
                }
            }
        } catch (error) {
            console.error('Failed to load courses:', error);
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

    // Combine enrolled courses with all courses for admin
    const enrolledCourseIds = enrollments.map(e => e.courseId);
    const adminOnlyCourses = isAdmin
        ? allCourses.filter(c => !enrolledCourseIds.includes(c.id))
        : [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">My Courses</h1>
                <p className="text-gray-400 mt-1">Your enrolled courses and learning progress</p>
            </div>

            {/* Enrolled Courses */}
            {enrollments.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Enrolled</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrollments.map((enrollment) => (
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
                </div>
            )}

            {/* Admin: All Courses Access */}
            {isAdmin && adminOnlyCourses.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">
                        All Courses <span className="text-xs text-gray-500">(Admin Access)</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {adminOnlyCourses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/learn/course/${course.id}`}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/30 hover:border-amber-400/50 transition group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-400">
                                        ADMIN ACCESS
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition">
                                    {course.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2">
                                    {course.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* No Courses */}
            {enrollments.length === 0 && adminOnlyCourses.length === 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
                    <p className="text-gray-400 mb-4">You don&apos;t have access to any courses yet.</p>
                    <Link
                        href="/pricing"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#F2419C] to-[#ff6bba] text-white rounded-xl font-medium hover:opacity-90 transition"
                    >
                        View Membership Tiers
                    </Link>
                </div>
            )}
        </div>
    );
}
