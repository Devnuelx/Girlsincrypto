'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Lead { id: string; name: string | null; email: string | null; phone: string | null; source: string; createdAt: string; }

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<{ total: number; bySource: Record<string, number> } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => { loadData(); }, []);

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
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const exportCSV = () => {
        const filtered = filter ? leads.filter(l => l.source === filter) : leads;
        const rows = [['Name', 'Email', 'Phone', 'Source', 'Date'], ...filtered.map(l => [l.name || '', l.email || '', l.phone || '', l.source, new Date(l.createdAt).toLocaleDateString()])];
        const csv = rows.map(r => r.join(',')).join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const sources = ['ADS', 'LANDING_PAGE', 'COLD_EMAIL', 'ORGANIC'];
    const filtered = filter ? leads.filter(l => l.source === filter) : leads;

    if (isLoading) return <div className="flex justify-center h-64"><div className="w-6 h-6 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-semibold text-[#1A1A1A]">Leads</h1><p className="text-sm text-[#9B9B9B]">Captured signups</p></div>
                <button onClick={exportCSV} className="px-5 py-2.5 bg-[#2C2C2C] text-white text-sm font-medium rounded-xl">Export CSV</button>
            </div>

            <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#E8E4DD]"><p className="text-sm text-[#9B9B9B]">Total</p><p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{stats?.total || 0}</p></div>
                {sources.map(s => (
                    <div key={s} onClick={() => setFilter(filter === s ? null : s)} className={`rounded-2xl p-5 border cursor-pointer ${filter === s ? 'bg-[#2C2C2C] border-[#2C2C2C]' : 'bg-white border-[#E8E4DD]'}`}>
                        <p className={`text-sm ${filter === s ? 'text-white/70' : 'text-[#9B9B9B]'}`}>{s.replace('_', ' ')}</p>
                        <p className={`text-2xl font-semibold mt-1 ${filter === s ? 'text-white' : 'text-[#1A1A1A]'}`}>{stats?.bySource?.[s] || 0}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
                <table className="w-full">
                    <thead><tr className="bg-[#FAF9F6]"><th className="text-left px-6 py-4 text-xs text-[#9B9B9B] uppercase">Name</th><th className="text-left px-6 py-4 text-xs text-[#9B9B9B] uppercase">Contact</th><th className="text-left px-6 py-4 text-xs text-[#9B9B9B] uppercase">Source</th><th className="text-left px-6 py-4 text-xs text-[#9B9B9B] uppercase">Date</th></tr></thead>
                    <tbody className="divide-y divide-[#E8E4DD]">
                        {filtered.map(l => (
                            <tr key={l.id}><td className="px-6 py-4 text-sm text-[#1A1A1A]">{l.name || '—'}</td><td className="px-6 py-4"><div>{l.email && <p className="text-sm text-[#1A1A1A]">{l.email}</p>}{l.phone && <p className="text-xs text-[#9B9B9B]">{l.phone}</p>}</div></td><td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs bg-[#F5F3EF] text-[#5C5C5C]">{l.source.replace('_', ' ')}</span></td><td className="px-6 py-4 text-sm text-[#9B9B9B]">{new Date(l.createdAt).toLocaleDateString()}</td></tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-[#9B9B9B]">No leads</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
