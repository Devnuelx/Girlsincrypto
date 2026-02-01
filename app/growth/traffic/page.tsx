'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function TrafficPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const [groups, leadsStats] = await Promise.all([
                fetch(`${API_URL}/traffic/groups`, { headers }).then(r => r.ok ? r.json() : []),
                fetch(`${API_URL}/traffic/leads/stats`, { headers }).then(r => r.ok ? r.json() : { total: 0, bySource: {} }),
            ]);
            const groupsArr = Array.isArray(groups) ? groups : [];
            const totalClicks = groupsArr.reduce((s: number, g: any) => s + (g.clickCount || 0), 0);
            const rate = totalClicks > 0 ? Math.round((leadsStats.total / totalClicks) * 100) : 0;
            setData({ totalClicks, totalLeads: leadsStats.total, conversionRate: rate, bySource: leadsStats.bySource, groups: groupsArr });
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    if (isLoading) return <div className="flex justify-center h-64"><div className="w-6 h-6 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-8">
            <div><h1 className="text-2xl font-semibold text-[#1A1A1A]">Traffic Intelligence</h1><p className="text-sm text-[#9B9B9B]">Funnel performance</p></div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-6">Conversion Funnel</h3>
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <div className="text-center"><div className="w-24 h-24 rounded-full bg-[#FAF9F6] border-4 border-[#2C2C2C] flex items-center justify-center"><span className="text-2xl font-semibold text-[#1A1A1A]">{data?.totalClicks || 0}</span></div><p className="text-sm text-[#9B9B9B] mt-2">Clicks</p></div>
                    <div className="flex-1 h-0.5 bg-[#E8E4DD] mx-4"></div>
                    <div className="text-center"><div className="w-20 h-20 rounded-full bg-[#FAF9F6] border-4 border-[#D4A574] flex items-center justify-center"><span className="text-xl font-semibold text-[#1A1A1A]">{data?.totalLeads || 0}</span></div><p className="text-sm text-[#9B9B9B] mt-2">Leads</p></div>
                    <div className="flex-1 h-0.5 bg-[#E8E4DD] mx-4"></div>
                    <div className="text-center"><div className="w-16 h-16 rounded-full bg-[#FAF9F6] border-4 border-[#4A7C4A] flex items-center justify-center"><span className="text-lg font-semibold text-[#1A1A1A]">{data?.conversionRate || 0}%</span></div><p className="text-sm text-[#9B9B9B] mt-2">Rate</p></div>
                </div>
            </div>

            {data?.bySource && Object.keys(data.bySource).length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                    <h3 className="text-sm font-medium text-[#1A1A1A] mb-4">Leads by Source</h3>
                    {Object.entries(data.bySource).map(([source, count]) => {
                        const pct = data.totalLeads > 0 ? Math.round((Number(count) / data.totalLeads) * 100) : 0;
                        return (
                            <div key={source} className="mb-3">
                                <div className="flex justify-between text-sm mb-1"><span className="text-[#5C5C5C]">{source.replace('_', ' ')}</span><span className="text-[#1A1A1A] font-medium">{count as number}</span></div>
                                <div className="w-full h-2 bg-[#E8E4DD] rounded-full"><div className="h-2 bg-[#2C2C2C] rounded-full" style={{ width: `${pct}%` }}></div></div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
