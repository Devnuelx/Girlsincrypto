'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { coursesApi, usersApi } from '../../../lib/api';

interface Stats {
    totalCourses: number;
    publishedCourses: number;
    totalUsers: number;
    recentCourses: any[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalCourses: 0,
        publishedCourses: 0,
        totalUsers: 0,
        recentCourses: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [allCourses, usersData] = await Promise.all([
                    coursesApi.getAll(),
                    usersApi.getAll(0, 1),
                ]);

                setStats({
                    totalCourses: allCourses.length,
                    publishedCourses: allCourses.filter((c: any) => c.isPublished).length,
                    totalUsers: usersData.total,
                    recentCourses: allCourses.slice(0, 5),
                });
            } catch (error) {
                console.error('Failed to load stats:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadStats();
    }, []);

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
                <h1 className="text-3xl font-bold text-white font-space">Admin Dashboard</h1>
                <p className="mt-2 text-gray-400">Manage your learning platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Courses</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalCourses}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Published</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">{stats.publishedCourses}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Drafts</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">
                        {stats.totalCourses - stats.publishedCourses}
                    </p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-[#F2419C] mt-2">{stats.totalUsers}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
                <Link
                    href="/admin/courses/new"
                    className="px-6 py-3 bg-[#F2419C] text-white rounded-lg font-semibold hover:bg-pink-500 transition"
                >
                    + Create Course
                </Link>
                <Link
                    href="/admin/users"
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                    Manage Users
                </Link>
            </div>

            {/* Recent Courses */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white font-space">Recent Courses</h2>
                    <Link href="/admin/courses" className="text-[#F2419C] font-medium hover:underline">
                        View All →
                    </Link>
                </div>

                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-300 font-medium">Title</th>
                                <th className="text-left px-6 py-3 text-gray-300 font-medium">Access Type</th>
                                <th className="text-left px-6 py-3 text-gray-300 font-medium">Status</th>
                                <th className="text-left px-6 py-3 text-gray-300 font-medium">Enrollments</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {stats.recentCourses.map((course: any) => (
                                <tr key={course.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 text-white font-medium">{course.title}</td>
                                    <td className="px-6 py-4 text-gray-400">{course.accessType}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${course.isPublished
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                                }`}
                                        >
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{course._count?.enrollments || 0}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/courses/${course.id}`}
                                            className="text-[#F2419C] hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentCourses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        No courses yet. Create your first course!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
