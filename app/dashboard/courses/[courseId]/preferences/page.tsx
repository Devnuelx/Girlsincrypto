'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { enrollmentsApi } from '../../../../../lib/api';

const DAYS = [
    { value: 'MON', label: 'Monday' },
    { value: 'TUE', label: 'Tuesday' },
    { value: 'WED', label: 'Wednesday' },
    { value: 'THU', label: 'Thursday' },
    { value: 'FRI', label: 'Friday' },
    { value: 'SAT', label: 'Saturday' },
    { value: 'SUN', label: 'Sunday' },
];

export default function EditPreferencesPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;

    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [originalDays, setOriginalDays] = useState<string[]>([]);
    const [courseName, setCourseName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const loadEnrollment = useCallback(async () => {
        try {
            const data = await enrollmentsApi.getMyForCourse(courseId);
            if (data) {
                setSelectedDays(data.preferredDays || []);
                setOriginalDays(data.preferredDays || []);
                setCourseName(data.course?.title || 'Course');
            }
        } catch (error) {
            console.error('Failed to load enrollment:', error);
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        loadEnrollment();
    }, [loadEnrollment]);

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSave = async () => {
        if (selectedDays.length === 0) {
            setError('Please select at least one day');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            await enrollmentsApi.updatePreferences(courseId, selectedDays);
            router.push(`/dashboard/courses/${courseId}`);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = JSON.stringify(selectedDays.sort()) !== JSON.stringify(originalDays.sort());

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <Link
                    href={`/dashboard/courses/${courseId}`}
                    className="text-gray-500 hover:text-[#F2419C] text-sm mb-2 inline-block"
                >
                    ← Back to Course
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 font-space">Edit Learning Days</h1>
                <p className="text-gray-600 mt-1">Choose when you want new lessons to unlock for {courseName}</p>
            </div>

            <div className="bg-white rounded-2xl border border-pink-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Select Your Preferred Days</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Lessons will unlock only on these days, spread across your course duration.
                    Already unlocked lessons will remain accessible.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {DAYS.map((day) => {
                        const isSelected = selectedDays.includes(day.value);
                        return (
                            <button
                                key={day.value}
                                onClick={() => toggleDay(day.value)}
                                className={`p-4 rounded-xl border-2 transition text-center ${isSelected
                                        ? 'border-[#F2419C] bg-[#fff0f7] text-[#F2419C]'
                                        : 'border-gray-200 hover:border-pink-200 text-gray-600'
                                    }`}
                            >
                                <span className="font-medium">{day.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Selected: <span className="font-medium text-gray-900">{selectedDays.length} days</span>
                            </p>
                            {selectedDays.length > 0 && (
                                <p className="text-xs text-gray-400 mt-1">
                                    {selectedDays.map(d => DAYS.find(day => day.value === d)?.label).join(', ')}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                className="px-6 py-2 bg-[#F2419C] text-white rounded-lg font-medium hover:bg-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-medium text-[#F2419C] mb-1">💡 How it works</p>
                <p>
                    Your lessons will be spread across your selected days over the course duration.
                    If you change your days mid-course, upcoming lessons will be rescheduled,
                    but lessons you&apos;ve already unlocked will stay accessible.
                </p>
            </div>
        </div>
    );
}
