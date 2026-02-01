'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface DashboardData {
    totalClicks: number;
    totalLeads: number;
    activeGroups: number;
    groupsNearCapacity: number;
    groups: Array<{ name: string; clickCount: number; maxClicks: number; isActive: boolean }>;
    sourceBreakdown: Record<string, number>;
}

export default function GrowthPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7' | '30'>('7');

    useEffect(() => {
        loadData();
    }, [timeRange]);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [groups, leads] = await Promise.all([
                fetch(`${API_URL}/traffic/groups`, { headers }).then(r => r.ok ? r.json() : []),
                fetch(`${API_URL}/traffic/leads/stats`, { headers }).then(r => r.ok ? r.json() : { total: 0, bySource: {} }),
            ]);

            const groupsArray = Array.isArray(groups) ? groups : [];
            const totalClicks = groupsArray.reduce((sum: number, g: any) => sum + (g.clickCount || 0), 0);
            const activeGroups = groupsArray.filter((g: any) => g.isActive).length;
            const groupsNearCapacity = groupsArray.filter((g: any) => g.clickCount >= g.maxClicks * 0.9).length;

            setData({
                totalClicks,
                totalLeads: leads.total || 0,
                activeGroups,
                groupsNearCapacity,
                groups: groupsArray,
                sourceBreakdown: leads.bySource || {},
            });
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Overview</h1>
                    <p className="text-sm text-[#9B9B9B] mt-1">Your community growth at a glance</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTimeRange('7')}
                        className={`px-4 py-2 text-sm rounded-lg transition ${timeRange === '7' ? 'bg-[#2C2C2C] text-white' : 'bg-[#F5F3EF] text-[#5C5C5C]'}`}
                    >
                        7 days
                    </button>
                    <button
                        onClick={() => setTimeRange('30')}
                        className={`px-4 py-2 text-sm rounded-lg transition ${timeRange === '30' ? 'bg-[#2C2C2C] text-white' : 'bg-[#F5F3EF] text-[#5C5C5C]'}`}
                    >
                        30 days
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                    <p className="text-sm text-[#9B9B9B] font-medium">Total Clicks</p>
                    <p className="text-3xl font-semibold text-[#1A1A1A] mt-2">{data?.totalClicks || 0}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                    <p className="text-sm text-[#9B9B9B] font-medium">Leads Captured</p>
                    <p className="text-3xl font-semibold text-[#1A1A1A] mt-2">{data?.totalLeads || 0}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                    <p className="text-sm text-[#9B9B9B] font-medium">Active Groups</p>
                    <p className="text-3xl font-semibold text-[#1A1A1A] mt-2">{data?.activeGroups || 0}</p>
                </div>
                <div className={`rounded-2xl p-6 border ${data?.groupsNearCapacity ? 'bg-[#FEF3E7] border-[#F5D5B5]' : 'bg-white border-[#E8E4DD]'}`}>
                    <p className="text-sm text-[#9B9B9B] font-medium">Near Capacity</p>
                    <p className={`text-3xl font-semibold mt-2 ${data?.groupsNearCapacity ? 'text-[#D4A574]' : 'text-[#1A1A1A]'}`}>
                        {data?.groupsNearCapacity || 0}
                    </p>
                </div>
            </div>

            {data?.groups && data.groups.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E8E4DD]">
                        <h3 className="text-sm font-medium text-[#1A1A1A]">WhatsApp Groups</h3>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#FAF9F6]">
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#9B9B9B] uppercase">Group</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#9B9B9B] uppercase">Capacity</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#9B9B9B] uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E4DD]">
                            {data.groups.slice(0, 5).map((group, i) => {
                                const progress = Math.round((group.clickCount / group.maxClicks) * 100);
                                return (
                                    <tr key={i}>
                                        <td className="px-6 py-4 text-sm font-medium text-[#1A1A1A]">{group.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-[#E8E4DD] rounded-full">
                                                    <div className={`h-2 rounded-full ${progress >= 90 ? 'bg-[#D4A574]' : 'bg-[#2C2C2C]'}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                                </div>
                                                <span className="text-sm text-[#9B9B9B]">{group.clickCount}/{group.maxClicks}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${group.isActive ? 'bg-[#E8F5E8] text-[#4A7C4A]' : 'bg-[#F5F3EF] text-[#9B9B9B]'}`}>
                                                {group.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
