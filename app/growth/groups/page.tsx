'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface WhatsappGroup {
    id: string;
    name: string;
    inviteLink: string;
    clickCount: number;
    maxClicks: number;
    isActive: boolean;
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<WhatsappGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', inviteLink: '', maxClicks: '900' });

    useEffect(() => { loadGroups(); }, []);

    const loadGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/traffic/groups`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            if (res.ok) setGroups(await res.json());
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const addGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/traffic/groups`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ tenantSlug: 'gich', ...newGroup, maxClicks: parseInt(newGroup.maxClicks) }),
        });
        setShowAdd(false);
        setNewGroup({ name: '', inviteLink: '', maxClicks: '900' });
        loadGroups();
    };

    const toggle = async (g: WhatsappGroup) => {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/traffic/groups/${g.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ isActive: !g.isActive }),
        });
        loadGroups();
    };

    if (isLoading) return <div className="flex justify-center h-64"><div className="w-6 h-6 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-semibold text-[#1A1A1A]">WhatsApp Groups</h1><p className="text-sm text-[#9B9B9B]">Manage rotator groups</p></div>
                <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-[#2C2C2C] text-white text-sm font-medium rounded-xl">Add Group</button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
                <table className="w-full">
                    <thead><tr className="bg-[#FAF9F6]"><th className="text-left px-6 py-4 text-xs text-[#9B9B9B] uppercase">Group</th><th className="text-left px-6 py-4 text-xs text-[#9B9B9B] uppercase">Capacity</th><th className="text-left px-6 py-4 text-xs text-[#9B9B9B] uppercase">Status</th></tr></thead>
                    <tbody className="divide-y divide-[#E8E4DD]">
                        {groups.map(g => {
                            const pct = Math.round((g.clickCount / g.maxClicks) * 100);
                            return (
                                <tr key={g.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-[#1A1A1A]">{g.name}</td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-32 h-2 bg-[#E8E4DD] rounded-full"><div className={`h-2 rounded-full ${pct >= 90 ? 'bg-[#D4A574]' : 'bg-[#2C2C2C]'}`} style={{ width: `${Math.min(pct, 100)}%` }}></div></div><span className="text-sm text-[#9B9B9B]">{g.clickCount}/{g.maxClicks}</span></div></td>
                                    <td className="px-6 py-4"><button onClick={() => toggle(g)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${g.isActive ? 'bg-[#E8F5E8] text-[#4A7C4A]' : 'bg-[#F5F3EF] text-[#9B9B9B]'}`}>{g.isActive ? 'Active' : 'Inactive'}</button></td>
                                </tr>
                            );
                        })}
                        {groups.length === 0 && <tr><td colSpan={3} className="px-6 py-12 text-center text-[#9B9B9B]">No groups yet</td></tr>}
                    </tbody>
                </table>
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Add Group</h2>
                        <form onSubmit={addGroup} className="space-y-4">
                            <input value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="Group Name" required className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E8E4DD]" />
                            <input value={newGroup.inviteLink} onChange={e => setNewGroup({ ...newGroup, inviteLink: e.target.value })} placeholder="Invite Link" required className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E8E4DD]" />
                            <input type="number" value={newGroup.maxClicks} onChange={e => setNewGroup({ ...newGroup, maxClicks: e.target.value })} placeholder="Max Members" className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E8E4DD]" />
                            <div className="flex gap-3"><button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-[#F5F3EF] text-[#5C5C5C] rounded-xl">Cancel</button><button type="submit" className="flex-1 py-3 bg-[#2C2C2C] text-white rounded-xl">Add</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
