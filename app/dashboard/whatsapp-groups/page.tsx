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
    createdAt: string;
}

export default function WhatsAppGroupsPage() {
    const [groups, setGroups] = useState<WhatsappGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<WhatsappGroup | null>(null);
    const [newGroup, setNewGroup] = useState({ name: '', inviteLink: '', maxClicks: '900' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/traffic/groups`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) setGroups(await res.json());
        } catch (error) {
            console.error('Failed to load groups:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/traffic/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    tenantSlug: 'gich',
                    name: newGroup.name,
                    inviteLink: newGroup.inviteLink,
                    maxClicks: parseInt(newGroup.maxClicks),
                }),
            });
            setShowAddModal(false);
            setNewGroup({ name: '', inviteLink: '', maxClicks: '900' });
            loadGroups();
        } catch (error) {
            console.error('Failed to add group:', error);
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (group: WhatsappGroup) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/traffic/groups/${group.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ isActive: !group.isActive }),
            });
            loadGroups();
        } catch (error) {
            console.error('Failed to toggle group:', error);
        }
    };

    const updateMaxClicks = async (groupId: string, maxClicks: number) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/traffic/groups/${groupId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ maxClicks }),
            });
            setEditingGroup(null);
            loadGroups();
        } catch (error) {
            console.error('Failed to update group:', error);
        }
    };

    const getProgress = (group: WhatsappGroup) => Math.round((group.clickCount / group.maxClicks) * 100);

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
                    <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">WhatsApp Groups</h1>
                    <p className="text-sm text-[#9B9B9B] mt-1">Manage your community circles and rotator</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 bg-[#2C2C2C] text-white text-sm font-medium rounded-xl hover:bg-[#3C3C3C] transition"
                >
                    Add Group
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#E8E4DD]">
                    <p className="text-sm text-[#9B9B9B]">Total Groups</p>
                    <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{groups.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-[#E8E4DD]">
                    <p className="text-sm text-[#9B9B9B]">Active</p>
                    <p className="text-2xl font-semibold text-[#4A7C4A] mt-1">{groups.filter(g => g.isActive).length}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-[#E8E4DD]">
                    <p className="text-sm text-[#9B9B9B]">Total Clicks</p>
                    <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{groups.reduce((sum, g) => sum + g.clickCount, 0)}</p>
                </div>
            </div>

            {/* Groups List */}
            <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#FAF9F6]">
                            <th className="text-left px-6 py-4 text-xs font-medium text-[#9B9B9B] uppercase tracking-wider">Group</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-[#9B9B9B] uppercase tracking-wider">Capacity</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-[#9B9B9B] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-medium text-[#9B9B9B] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E4DD]">
                        {groups.map((group) => {
                            const progress = getProgress(group);
                            return (
                                <tr key={group.id} className="hover:bg-[#FAF9F6]/50 transition">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-[#1A1A1A]">{group.name}</p>
                                        <p className="text-xs text-[#9B9B9B] mt-0.5">Link hidden for security</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 h-2 bg-[#E8E4DD] rounded-full">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${progress >= 100 ? 'bg-[#C74A4A]' : progress >= 90 ? 'bg-[#D4A574]' : 'bg-[#2C2C2C]'
                                                        }`}
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-[#9B9B9B] whitespace-nowrap">
                                                {group.clickCount} / {group.maxClicks}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleActive(group)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${group.isActive
                                                    ? 'bg-[#E8F5E8] text-[#4A7C4A] hover:bg-[#D4ECD4]'
                                                    : 'bg-[#F5F3EF] text-[#9B9B9B] hover:bg-[#EBE8E2]'
                                                }`}
                                        >
                                            {group.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setEditingGroup(group)}
                                            className="text-sm text-[#9B9B9B] hover:text-[#1A1A1A] transition"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {groups.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-[#9B9B9B]">
                                    No groups yet. Add your first WhatsApp group to start.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Group Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Add WhatsApp Group</h2>
                        <form onSubmit={handleAddGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#5C5C5C] mb-1.5">Group Name</label>
                                <input
                                    type="text"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    required
                                    placeholder="Circle #01"
                                    className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E8E4DD] text-[#1A1A1A] focus:border-[#2C2C2C] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#5C5C5C] mb-1.5">Invite Link</label>
                                <input
                                    type="url"
                                    value={newGroup.inviteLink}
                                    onChange={(e) => setNewGroup({ ...newGroup, inviteLink: e.target.value })}
                                    required
                                    placeholder="https://chat.whatsapp.com/..."
                                    className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E8E4DD] text-[#1A1A1A] focus:border-[#2C2C2C] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#5C5C5C] mb-1.5">Max Members</label>
                                <input
                                    type="number"
                                    value={newGroup.maxClicks}
                                    onChange={(e) => setNewGroup({ ...newGroup, maxClicks: e.target.value })}
                                    min="1"
                                    className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E8E4DD] text-[#1A1A1A] focus:border-[#2C2C2C] focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-[#F5F3EF] text-[#5C5C5C] rounded-xl font-medium hover:bg-[#EBE8E2] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-[#2C2C2C] text-white rounded-xl font-medium disabled:opacity-50 transition"
                                >
                                    {saving ? 'Adding...' : 'Add Group'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingGroup && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Edit {editingGroup.name}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#5C5C5C] mb-1.5">Max Members</label>
                                <input
                                    type="number"
                                    defaultValue={editingGroup.maxClicks}
                                    id="editMaxClicks"
                                    min="1"
                                    className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E8E4DD] text-[#1A1A1A] focus:border-[#2C2C2C] focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setEditingGroup(null)}
                                    className="flex-1 py-3 bg-[#F5F3EF] text-[#5C5C5C] rounded-xl font-medium hover:bg-[#EBE8E2] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('editMaxClicks') as HTMLInputElement;
                                        updateMaxClicks(editingGroup.id, parseInt(input.value));
                                    }}
                                    className="flex-1 py-3 bg-[#2C2C2C] text-white rounded-xl font-medium transition"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
