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

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<{ total: number; bySource: Record<string, number> } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sourceFilter, setSourceFilter] = useState<string | null>(null);

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

    const exportToCSV = () => {
        const filteredLeads = sourceFilter ? leads.filter(l => l.source === sourceFilter) : leads;
        const headers = ['Name', 'Email', 'Phone', 'Source', 'Date'];
        const rows = filteredLeads.map(l => [
            l.name || '',
            l.email || '',
            l.phone || '',
            l.source,
            new Date(l.createdAt).toLocaleDateString(),
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const filteredLeads = sourceFilter ? leads.filter(l => l.source === sourceFilter) : leads;
    const sources = ['ADS', 'LANDING_PAGE', 'COLD_EMAIL', 'ORGANIC'];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Leads</h1>
                    <p className="text-sm text-[#9B9B9B] mt-1">All captured signups from your funnels</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="px-5 py-2.5 bg-[#2C2C2C] text-white text-sm font-medium rounded-xl hover:bg-[#3C3C3C] transition"
                >
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#E8E4DD]">
                    <p className="text-sm text-[#9B9B9B]">Total</p>
                    <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{stats?.total || 0}</p>
                </div>
                {sources.map(source => (
                    <div
                        key={source}
                        onClick={() => setSourceFilter(sourceFilter === source ? null : source)}
                        className={`rounded-2xl p-5 border cursor-pointer transition ${sourceFilter === source
                                ? 'bg-[#2C2C2C] border-[#2C2C2C]'
                                : 'bg-white border-[#E8E4DD] hover:border-[#C8C4BD]'
                            }`}
                    >
                        <p className={`text-sm ${sourceFilter === source ? 'text-white/70' : 'text-[#9B9B9B]'}`}>
                            {source.replace('_', ' ')}
                        </p>
                        <p className={`text-2xl font-semibold mt-1 ${sourceFilter === source ? 'text-white' : 'text-[#1A1A1A]'}`}>
                            {stats?.bySource?.[source] || 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#FAF9F6]">
                            <th className="text-left px-6 py-4 text-xs font-medium text-[#9B9B9B] uppercase tracking-wider">Name</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-[#9B9B9B] uppercase tracking-wider">Contact</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-[#9B9B9B] uppercase tracking-wider">Source</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-[#9B9B9B] uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E4DD]">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-[#FAF9F6]/50 transition">
                                <td className="px-6 py-4">
                                    <p className="text-sm text-[#1A1A1A]">{lead.name || '—'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        {lead.email && <p className="text-sm text-[#1A1A1A]">{lead.email}</p>}
                                        {lead.phone && <p className="text-xs text-[#9B9B9B] mt-0.5">{lead.phone}</p>}
                                        {!lead.email && !lead.phone && <span className="text-[#9B9B9B]">—</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F3EF] text-[#5C5C5C]">
                                        {lead.source.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#9B9B9B]">
                                    {formatDate(lead.createdAt)}
                                </td>
                            </tr>
                        ))}
                        {filteredLeads.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-[#9B9B9B]">
                                    No leads captured yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
