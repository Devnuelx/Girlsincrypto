'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// import { coursesApi } from '@/lib/api';
import { coursesApi } from '../../../lib/api';

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await coursesApi.getAll();
            setCourses(data);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async (id: string, publish: boolean) => {
        try {
            await coursesApi.publish(id, publish);
            loadCourses();
        } catch (error) {
            console.error('Failed to update course:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await coursesApi.delete(id);
            loadCourses();
        } catch (error) {
            console.error('Failed to delete course:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-space">Courses</h1>
                    <p className="mt-2 text-gray-400">Manage your course catalog</p>
                </div>
                <Link
                    href="/admin/courses/new"
                    className="px-6 py-3 bg-[#F2419C] text-white rounded-lg font-semibold hover:bg-pink-500 transition"
                >
                    + Create Course
                </Link>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Course</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Modules</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Tier</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Enrolled</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Status</th>
                            <th className="px-6 py-3 text-gray-300 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-750">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-white font-medium">{course.title}</p>
                                        <p className="text-sm text-gray-400">/{course.slug}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {course.modules?.length || 0} modules
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${course.tier === 'SOVEREIGN'
                                                ? 'bg-amber-500/20 text-amber-400'
                                                : course.tier === 'EMPRESS'
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : 'bg-pink-500/20 text-pink-400'
                                            }`}
                                    >
                                        {course.tier === 'SOVEREIGN' ? '🌟' : course.tier === 'EMPRESS' ? '💎' : '👑'} {course.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {course._count?.enrollments || 0}
                                    {course.isCapped && course.maxEnrollments && (
                                        <span className="text-gray-500"> / {course.maxEnrollments}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handlePublish(course.id, !course.isPublished)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${course.isPublished
                                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                            }`}
                                    >
                                        {course.isPublished ? 'Published' : 'Draft'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/courses/${course.id}`}
                                        className="text-[#F2419C] hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="text-red-400 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                    No courses yet.{' '}
                                    <Link href="/admin/courses/new" className="text-[#F2419C] hover:underline">
                                        Create your first course
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
