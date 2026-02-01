'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { coursesApi } from '../../../../lib/api';

const TIERS = [
    { value: 'HEIRESS', label: 'Heiress (Entry)', color: 'bg-pink-100 text-pink-700' },
    { value: 'EMPRESS', label: 'Empress (Mid)', color: 'bg-purple-100 text-purple-700' },
    { value: 'SOVEREIGN', label: 'Sovereign (Top)', color: 'bg-amber-100 text-amber-700' },
];

export default function NewCoursePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tier: 'HEIRESS',
        minDurationWeeks: 4,
        maxLessonsPerWeek: 5,
        allowDayChoice: true,
        isCapped: false,
        maxEnrollments: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = {
                ...formData,
                maxEnrollments: formData.isCapped && formData.maxEnrollments
                    ? parseInt(formData.maxEnrollments)
                    : null,
            };
            const course = await coursesApi.create(data);
            router.push(`/admin/courses/${course.id}`);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white font-space mb-8">Create New Course</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-[#F2419C] focus:border-transparent outline-none transition"
                        placeholder="e.g. Crypto Trading Fundamentals"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-[#F2419C] focus:border-transparent outline-none transition resize-none"
                        placeholder="What will students learn in this course?"
                    />
                </div>

                {/* Tier Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Access Tier *
                    </label>
                    <p className="text-xs text-gray-400 mb-3">
                        Who can access this course? Higher tiers include access to lower tiers.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {TIERS.map((tier) => (
                            <button
                                key={tier.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, tier: tier.value })}
                                className={`p-4 rounded-xl border-2 transition text-center ${formData.tier === tier.value
                                        ? 'border-[#F2419C] bg-[#F2419C]/10'
                                        : 'border-gray-600 hover:border-gray-500'
                                    }`}
                            >
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${tier.color}`}>
                                    {tier.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Enrollment Cap */}
                <div className="bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-white">Cap Enrollment</label>
                            <p className="text-xs text-gray-400 mt-1">Limit the number of students who can enroll</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isCapped: !formData.isCapped })}
                            className={`w-12 h-6 rounded-full transition ${formData.isCapped ? 'bg-[#F2419C]' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`block w-5 h-5 rounded-full bg-white transition transform ${formData.isCapped ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                    {formData.isCapped && (
                        <input
                            type="number"
                            value={formData.maxEnrollments}
                            onChange={(e) => setFormData({ ...formData, maxEnrollments: e.target.value })}
                            min="1"
                            className="mt-3 w-full px-4 py-2 rounded-lg bg-gray-600 border border-gray-500 text-white"
                            placeholder="Maximum enrollments"
                        />
                    )}
                </div>

                {/* Schedule Settings */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Min Duration (weeks)
                        </label>
                        <input
                            type="number"
                            value={formData.minDurationWeeks}
                            onChange={(e) => setFormData({ ...formData, minDurationWeeks: parseInt(e.target.value) })}
                            min="1"
                            max="52"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Max Lessons/Week
                        </label>
                        <input
                            type="number"
                            value={formData.maxLessonsPerWeek}
                            onChange={(e) => setFormData({ ...formData, maxLessonsPerWeek: parseInt(e.target.value) })}
                            min="1"
                            max="7"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                        />
                    </div>
                </div>

                {/* Allow Day Choice */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="allowDayChoice"
                        checked={formData.allowDayChoice}
                        onChange={(e) => setFormData({ ...formData, allowDayChoice: e.target.checked })}
                        className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-[#F2419C] focus:ring-[#F2419C]"
                    />
                    <label htmlFor="allowDayChoice" className="text-sm text-gray-300">
                        Allow students to choose preferred learning days
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#F2419C] text-white rounded-lg font-semibold hover:bg-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating...' : 'Create Course'}
                </button>
            </form>
        </div>
    );
}
