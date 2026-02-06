const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Generic API client with auth header
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }

    return res.json();
}

// Courses API
export const coursesApi = {
    getAll: (published?: boolean) =>
        apiRequest<any[]>(`/courses${published !== undefined ? `?published=${published}` : ''}`),

    getById: (id: string) => apiRequest<any>(`/courses/${id}`),

    getBySlug: (slug: string) => apiRequest<any>(`/courses/slug/${slug}`),

    create: (data: any) =>
        apiRequest<any>('/courses', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: any) =>
        apiRequest<any>(`/courses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    publish: (id: string, publish: boolean) =>
        apiRequest<any>(`/courses/${id}/publish`, {
            method: 'PATCH',
            body: JSON.stringify({ publish })
        }),

    delete: (id: string) =>
        apiRequest<void>(`/courses/${id}`, { method: 'DELETE' }),
};

// Modules API
export const modulesApi = {
    create: (courseId: string, data: any) =>
        apiRequest<any>(`/courses/${courseId}/modules`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    update: (courseId: string, moduleId: string, data: any) =>
        apiRequest<any>(`/courses/${courseId}/modules/${moduleId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    delete: (courseId: string, moduleId: string) =>
        apiRequest<void>(`/courses/${courseId}/modules/${moduleId}`, { method: 'DELETE' }),

    reorder: (courseId: string, moduleIds: string[]) =>
        apiRequest<void>(`/courses/${courseId}/modules/reorder`, {
            method: 'POST',
            body: JSON.stringify({ moduleIds })
        }),
};

// Lessons API
export const lessonsApi = {
    create: (moduleId: string, data: any) =>
        apiRequest<any>(`/modules/${moduleId}/lessons`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    update: (moduleId: string, lessonId: string, data: any) =>
        apiRequest<any>(`/modules/${moduleId}/lessons/${lessonId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    delete: (moduleId: string, lessonId: string) =>
        apiRequest<void>(`/modules/${moduleId}/lessons/${lessonId}`, { method: 'DELETE' }),

    reorder: (moduleId: string, lessonIds: string[]) =>
        apiRequest<void>(`/modules/${moduleId}/lessons/reorder`, {
            method: 'POST',
            body: JSON.stringify({ lessonIds })
        }),
};

// Enrollments API
export const enrollmentsApi = {
    enroll: (courseId: string, preferredDays: string[], startDate?: string) =>
        apiRequest<any>('/enrollments', {
            method: 'POST',
            body: JSON.stringify({ courseId, preferredDays, startDate })
        }),

    getMy: () => apiRequest<any[]>('/enrollments/my'),

    getMyForCourse: (courseId: string) => apiRequest<any>(`/enrollments/my/${courseId}`),

    updatePreferences: (courseId: string, preferredDays: string[]) =>
        apiRequest<any>(`/enrollments/my/${courseId}/preferences`, {
            method: 'PATCH',
            body: JSON.stringify({ preferredDays })
        }),

    checkAccess: (courseId: string, lessonId: string) =>
        apiRequest<any>(`/enrollments/access/${courseId}/${lessonId}`),

    markComplete: (lessonId: string) =>
        apiRequest<any>(`/enrollments/progress/${lessonId}/complete`, { method: 'POST' }),

    updateWatch: (lessonId: string, watchTime: number, lastPosition: number) =>
        apiRequest<any>(`/enrollments/progress/${lessonId}/watch`, {
            method: 'PATCH',
            body: JSON.stringify({ watchTime, lastPosition })
        }),
};

// Users API (Admin)
export const usersApi = {
    getAll: (skip = 0, take = 50) =>
        apiRequest<{ users: any[]; total: number }>(`/users?skip=${skip}&take=${take}`),

    getById: (id: string) => apiRequest<any>(`/users/${id}`),

    update: (id: string, data: any) =>
        apiRequest<any>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: string) =>
        apiRequest<void>(`/users/${id}`, { method: 'DELETE' }),

    setOverride: (userId: string, courseId: string, override: boolean) =>
        apiRequest<any>(`/enrollments/${userId}/${courseId}/override`, {
            method: 'PATCH',
            body: JSON.stringify({ override })
        }),
};

// Payments API - Tier-based
export const paymentsApi = {
    getTiers: () => apiRequest<any[]>('/payments/tiers'),

    getMyTiers: () => apiRequest<{
        purchasedTiers: string[];
        highestTier: string | null;
        accessibleTiers: string[];
    }>('/payments/my-tiers'),

    createTierCheckout: (tier: string) =>
        apiRequest<{ link: string }>(`/payments/checkout/${tier}`, { method: 'POST' }),
};

// Analytics API (Admin)
export const analyticsApi = {
    getDashboard: () => apiRequest<any>('/analytics/dashboard'),
    getRevenue: () => apiRequest<any>('/analytics/revenue'),
    getEnrollmentTrend: () => apiRequest<any[]>('/analytics/enrollments/trend'),
    getTopCourses: () => apiRequest<any[]>('/analytics/courses/top'),
    getCompletion: () => apiRequest<any>('/analytics/completion'),
};

export default apiRequest;
