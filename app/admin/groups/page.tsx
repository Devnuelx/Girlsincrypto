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

export default function AdminGroupsPage() {
    const [groups, setGroups] = useState<WhatsappGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', inviteLink: '', maxClicks: '900' });
    const [saving, setSaving] = useState(false);

    // For demo, we'll use the GICH tenant
    const tenantId = 'gich';

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/traffic/groups`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                const data = await res.json();
                setGroups(data);
            }
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
            const res = await fetch(`${API_URL}/traffic/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    tenantSlug: tenantId,
                    name: newGroup.name,
                    inviteLink: newGroup.inviteLink,
                    maxClicks: parseInt(newGroup.maxClicks),
                }),
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewGroup({ name: '', inviteLink: '', maxClicks: '900' });
                loadGroups();
            }
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

    const getProgress = (group: WhatsappGroup) => {
        return Math.round((group.clickCount / group.maxClicks) * 100);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-space">WhatsApp Groups</h1>
                    <p className="mt-2 text-gray-400">Manage your community groups and rotator</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-[#F2419C] text-white rounded-lg font-semibold hover:bg-pink-500 transition"
                >
                    + Add Group
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Groups</p>
                    <p className="text-2xl font-bold text-white">{groups.length}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Active Groups</p>
                    <p className="text-2xl font-bold text-green-400">{groups.filter(g => g.isActive).length}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Clicks</p>
                    <p className="text-2xl font-bold text-[#F2419C]">{groups.reduce((sum, g) => sum + g.clickCount, 0)}</p>
                </div>
            </div>

            {/* Groups Table */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Group</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Progress</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Status</th>
                            <th className="px-6 py-3 text-gray-300 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {groups.map((group) => {
                            const progress = getProgress(group);
                            return (
                                <tr key={group.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{group.name}</p>
                                            <p className="text-sm text-gray-400 truncate max-w-xs">{group.inviteLink}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`rounded-full h-2 transition-all ${progress >= 100 ? 'bg-red-500' : progress >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-gray-400 text-sm">
                                                {group.clickCount} / {group.maxClicks}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleActive(group)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${group.isActive
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                }`}
                                        >
                                            {group.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            href={group.inviteLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#F2419C] hover:underline mr-4"
                                        >
                                            Open
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                        {groups.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                    No groups yet. Add your first WhatsApp group!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Rotator URL */}
            <div className="bg-gradient-to-r from-[#F2419C]/20 to-[#ff6bba]/20 rounded-xl p-6 border border-pink-500/30">
                <h3 className="text-lg font-bold text-white mb-2">Your Rotator Link</h3>
                <p className="text-gray-300 mb-3">Use this single link to route users to available groups:</p>
                <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-900 px-4 py-3 rounded-lg text-pink-400 font-mono text-sm">
                        {API_URL}/gich/join
                    </code>
                    <button
                        onClick={() => navigator.clipboard.writeText(`${API_URL}/gich/join`)}
                        className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Copy
                    </button>
                </div>
            </div>

            {/* Add Group Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Add WhatsApp Group</h2>
                        <form onSubmit={handleAddGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Group Name</label>
                                <input
                                    type="text"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    required
                                    placeholder="e.g. GICH Circle #04"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Invite Link</label>
                                <input
                                    type="url"
                                    value={newGroup.inviteLink}
                                    onChange={(e) => setNewGroup({ ...newGroup, inviteLink: e.target.value })}
                                    required
                                    placeholder="https://chat.whatsapp.com/..."
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Max Clicks</label>
                                <input
                                    type="number"
                                    value={newGroup.maxClicks}
                                    onChange={(e) => setNewGroup({ ...newGroup, maxClicks: e.target.value })}
                                    min="1"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-gray-700 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-[#F2419C] text-white rounded-lg font-semibold disabled:opacity-50"
                                >
                                    {saving ? 'Adding...' : 'Add Group'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
