const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }

    return res.json();
}

// Traffic Routing API
export const trafficApi = {
    // Tenants
    getTenants: () => apiRequest<any[]>('/tenants'),

    // WhatsApp Groups
    getGroups: (tenantId: string) => apiRequest<any[]>(`/traffic/tenants/${tenantId}/groups`),
    createGroup: (tenantId: string, data: { name: string; inviteLink: string; maxClicks?: number }) =>
        apiRequest<any>(`/traffic/tenants/${tenantId}/groups`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateGroup: (groupId: string, data: any) =>
        apiRequest<any>(`/traffic/groups/${groupId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    // Leads
    getLeads: (tenantId: string, skip = 0, take = 50) =>
        apiRequest<any[]>(`/traffic/tenants/${tenantId}/leads?skip=${skip}&take=${take}`),
    getLeadStats: (tenantId: string) =>
        apiRequest<any>(`/traffic/tenants/${tenantId}/leads/stats`),

    // Click Stats
    getClickStats: (tenantId: string) =>
        apiRequest<any>(`/traffic/tenants/${tenantId}/clicks/stats`),
};

export default trafficApi;
