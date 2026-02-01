'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Lead {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    source: string;
    createdAt: string;
}

const SOURCE_COLORS: Record<string, string> = {
    ADS: 'bg-blue-500/20 text-blue-400',
    LANDING_PAGE: 'bg-green-500/20 text-green-400',
    COLD_EMAIL: 'bg-purple-500/20 text-purple-400',
    ORGANIC: 'bg-gray-500/20 text-gray-400',
};

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<{ total: number; bySource: Record<string, number> } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [leadsRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/traffic/leads`, { headers }),
                fetch(`${API_URL}/traffic/leads/stats`, { headers }),
            ]);

            if (leadsRes.ok) setLeads(await leadsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error('Failed to load leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
            <div>
                <h1 className="text-3xl font-bold text-white font-space">Leads</h1>
                <p className="mt-2 text-gray-400">All captured leads from your funnels</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Leads</p>
                    <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">From Ads</p>
                    <p className="text-2xl font-bold text-blue-400">{stats?.bySource?.ADS || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Landing Page</p>
                    <p className="text-2xl font-bold text-green-400">{stats?.bySource?.LANDING_PAGE || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Cold Email</p>
                    <p className="text-2xl font-bold text-purple-400">{stats?.bySource?.COLD_EMAIL || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Organic</p>
                    <p className="text-2xl font-bold text-gray-400">{stats?.bySource?.ORGANIC || 0}</p>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Name</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Contact</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Source</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-750">
                                <td className="px-6 py-4 text-white">
                                    {lead.name || <span className="text-gray-500">—</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        {lead.email && <p className="text-white">{lead.email}</p>}
                                        {lead.phone && <p className="text-gray-400 text-sm">{lead.phone}</p>}
                                        {!lead.email && !lead.phone && <span className="text-gray-500">—</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${SOURCE_COLORS[lead.source] || SOURCE_COLORS.ORGANIC}`}>
                                        {lead.source}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {formatDate(lead.createdAt)}
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                    No leads captured yet. Share your community link to start collecting leads!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
