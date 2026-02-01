'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration?: number;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  tier: string;
  modules: Module[];
}

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { isAdmin } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Check access
      const accessRes = await fetch(`${API_URL}/courses/${courseId}/access`, { headers });
      if (accessRes.ok) {
        const accessData = await accessRes.json();
        setHasAccess(accessData.hasAccess || isAdmin);
      } else {
        setHasAccess(isAdmin);
      }

      // Load course
      const courseRes = await fetch(`${API_URL}/courses/${courseId}`, { headers });
      if (courseRes.ok) {
        const courseData = await courseRes.json();
        setCourse(courseData);

        // Set first lesson as active
        if (courseData.modules?.[0]?.lessons?.[0]) {
          setActiveLesson(courseData.modules[0].lessons[0]);
          setExpandedModules(new Set([courseData.modules[0].id]));
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Course not found</p>
        <Link href="/learn/courses" className="text-[#F2419C] hover:underline mt-2 inline-block">
          Back to courses
        </Link>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Access Required</h2>
        <p className="text-gray-400 mb-6">You need to purchase access to view this course.</p>
        <Link
          href="/pricing"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#F2419C] to-[#ff6bba] text-white rounded-xl font-medium"
        >
          View Membership Tiers
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-[calc(100vh-120px)]">
      {/* Sidebar - Curriculum */}
      <aside className="w-80 flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <Link href="/learn/courses" className="text-sm text-gray-400 hover:text-white transition">
            ← Back to courses
          </Link>
          <h2 className="text-lg font-semibold text-white mt-2">{course.title}</h2>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          {course.modules.map((module) => (
            <div key={module.id} className="border-b border-white/5">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition"
              >
                <span className="text-white font-medium text-sm">{module.title}</span>
                <span className="text-gray-500">{expandedModules.has(module.id) ? '−' : '+'}</span>
              </button>

              {expandedModules.has(module.id) && (
                <div className="pb-2">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full px-6 py-2 text-left text-sm transition ${
                        activeLesson?.id === lesson.id
                          ? 'text-[#F2419C] bg-pink-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {lesson.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {activeLesson ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            {/* Video Player */}
            {activeLesson.videoUrl && (
              <div className="aspect-video bg-black">
                <iframe
                  src={activeLesson.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            )}

            {/* Lesson Content */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-white mb-4">{activeLesson.title}</h1>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: activeLesson.content || '<p>No content available</p>' }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
            <p className="text-gray-400">Select a lesson to begin</p>
          </div>
        )}
      </main>
    </div>
  );
}
