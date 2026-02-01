'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { coursesApi, modulesApi, lessonsApi } from '../../../../lib/api';

interface Course {
    id: string;
    title: string;
    description: string;
    slug: string;
    price: number | null;
    accessType: string;
    isPublished: boolean;
    minDurationWeeks: number;
    maxLessonsPerWeek: number;
    allowDayChoice: boolean;
    modules: Module[];
}

interface Module {
    id: string;
    title: string;
    description: string;
    orderIndex: number;
    lessons: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
    description: string;
    contentUrl: string;
    contentType: string;
    orderIndex: number;
    isPreviewable: boolean;
    durationMinutes: number | null;
}

export default function CourseEditorPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
    const [moduleTitle, setModuleTitle] = useState('');
    const [lessonData, setLessonData] = useState({ title: '', contentUrl: '', contentType: 'VIDEO' });

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    const loadCourse = async () => {
        try {
            const data = await coursesApi.getById(courseId);
            setCourse(data);
            if (data.modules?.length > 0 && !activeModule) {
                setActiveModule(data.modules[0].id);
            }
        } catch (error) {
            console.error('Failed to load course:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddModule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await modulesApi.create(courseId, { title: moduleTitle });
            setModuleTitle('');
            setShowModuleForm(false);
            loadCourse();
        } catch (error) {
            console.error('Failed to add module:', error);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm('Delete this module and all its lessons?')) return;
        try {
            await modulesApi.delete(courseId, moduleId);
            loadCourse();
        } catch (error) {
            console.error('Failed to delete module:', error);
        }
    };

    const handleAddLesson = async (e: React.FormEvent, moduleId: string) => {
        e.preventDefault();
        try {
            await lessonsApi.create(moduleId, lessonData);
            setLessonData({ title: '', contentUrl: '', contentType: 'VIDEO' });
            setShowLessonForm(null);
            loadCourse();
        } catch (error) {
            console.error('Failed to add lesson:', error);
        }
    };

    const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            await lessonsApi.delete(moduleId, lessonId);
            loadCourse();
        } catch (error) {
            console.error('Failed to delete lesson:', error);
        }
    };

    const handlePublish = async () => {
        if (!course) return;
        try {
            await coursesApi.publish(courseId, !course.isPublished);
            loadCourse();
        } catch (error) {
            console.error('Failed to toggle publish:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!course) {
        return <div className="text-gray-400">Course not found</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/courses" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
                        ← Back to Courses
                    </Link>
                    <h1 className="text-3xl font-bold text-white font-space">{course.title}</h1>
                    <p className="text-gray-400 mt-1">/{course.slug}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePublish}
                        className={`px-4 py-2 rounded-lg font-medium transition ${course.isPublished
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            }`}
                    >
                        {course.isPublished ? '✓ Published' : 'Draft - Click to Publish'}
                    </button>
                </div>
            </div>

            {/* Course Info */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-gray-400">Access Type:</span>
                        <span className="text-white ml-2">{course.accessType}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white ml-2">{course.price ? `$${course.price}` : 'Free'}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white ml-2">{course.minDurationWeeks} weeks min</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Day Choice:</span>
                        <span className="text-white ml-2">{course.allowDayChoice ? 'Yes' : 'No'}</span>
                    </div>
                </div>
            </div>

            {/* Modules & Lessons */}
            <div className="grid grid-cols-3 gap-6">
                {/* Modules List */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Modules</h2>
                        <button
                            onClick={() => setShowModuleForm(true)}
                            className="text-[#F2419C] hover:text-pink-400 text-sm font-medium"
                        >
                            + Add
                        </button>
                    </div>

                    {showModuleForm && (
                        <form onSubmit={handleAddModule} className="mb-4 p-3 bg-gray-700 rounded-lg">
                            <input
                                type="text"
                                value={moduleTitle}
                                onChange={(e) => setModuleTitle(e.target.value)}
                                placeholder="Module title..."
                                className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 text-sm"
                                autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                                <button type="submit" className="px-3 py-1 bg-[#F2419C] text-white text-sm rounded">
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModuleForm(false)}
                                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-2">
                        {course.modules?.map((mod, index) => (
                            <div
                                key={mod.id}
                                onClick={() => setActiveModule(mod.id)}
                                className={`p-3 rounded-lg cursor-pointer transition ${activeModule === mod.id
                                        ? 'bg-[#F2419C] text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">
                                        {index + 1}. {mod.title}
                                    </span>
                                    <span className="text-xs opacity-70">{mod.lessons?.length || 0} lessons</span>
                                </div>
                            </div>
                        ))}
                        {(!course.modules || course.modules.length === 0) && (
                            <p className="text-gray-500 text-sm text-center py-4">No modules yet</p>
                        )}
                    </div>
                </div>

                {/* Lessons List */}
                <div className="col-span-2 bg-gray-800 rounded-2xl border border-gray-700 p-4">
                    {activeModule ? (
                        <>
                            {(() => {
                                const currentModule = course.modules?.find((m) => m.id === activeModule);
                                if (!currentModule) return <p className="text-gray-500">Module not found</p>;

                                return (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-white">{currentModule.title}</h2>
                                                <p className="text-gray-400 text-sm">{currentModule.lessons?.length || 0} lessons</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setShowLessonForm(activeModule)}
                                                    className="px-3 py-1 bg-[#F2419C] text-white text-sm rounded hover:bg-pink-500"
                                                >
                                                    + Add Lesson
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteModule(activeModule)}
                                                    className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded hover:bg-red-500/30"
                                                >
                                                    Delete Module
                                                </button>
                                            </div>
                                        </div>

                                        {showLessonForm === activeModule && (
                                            <form
                                                onSubmit={(e) => handleAddLesson(e, activeModule)}
                                                className="mb-4 p-4 bg-gray-700 rounded-lg space-y-3"
                                            >
                                                <input
                                                    type="text"
                                                    value={lessonData.title}
                                                    onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                                                    placeholder="Lesson title..."
                                                    className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 text-sm"
                                                    autoFocus
                                                />
                                                <input
                                                    type="text"
                                                    value={lessonData.contentUrl}
                                                    onChange={(e) => setLessonData({ ...lessonData, contentUrl: e.target.value })}
                                                    placeholder="Video URL (optional)..."
                                                    className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 text-sm"
                                                />
                                                <select
                                                    value={lessonData.contentType}
                                                    onChange={(e) => setLessonData({ ...lessonData, contentType: e.target.value })}
                                                    className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 text-sm"
                                                >
                                                    <option value="VIDEO">Video</option>
                                                    <option value="TEXT">Text</option>
                                                    <option value="PDF">PDF</option>
                                                    <option value="QUIZ">Quiz</option>
                                                </select>
                                                <div className="flex gap-2">
                                                    <button type="submit" className="px-4 py-2 bg-[#F2419C] text-white text-sm rounded">
                                                        Add Lesson
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowLessonForm(null)}
                                                        className="px-4 py-2 bg-gray-600 text-white text-sm rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        <div className="space-y-2">
                                            {currentModule.lessons?.map((lesson, index) => (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-500 text-sm">{index + 1}</span>
                                                        <div>
                                                            <p className="text-white font-medium text-sm">{lesson.title}</p>
                                                            <p className="text-gray-400 text-xs">
                                                                {lesson.contentType}{' '}
                                                                {lesson.durationMinutes && `• ${lesson.durationMinutes} min`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {lesson.isPreviewable && (
                                                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                                                Preview
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteLesson(currentModule.id, lesson.id)}
                                                            className="text-red-400 hover:text-red-300 text-sm"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!currentModule.lessons || currentModule.lessons.length === 0) && (
                                                <p className="text-gray-500 text-sm text-center py-8">
                                                    No lessons yet. Add your first lesson!
                                                </p>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </>
                    ) : (
                        <div className="text-gray-500 text-center py-12">
                            Select a module to view lessons
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
