'use client';

import { useEffect, useState, useCallback } from 'react';
import { usersApi } from '../../../lib/api';

interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const pageSize = 20;

    const loadUsers = useCallback(async () => {
        try {
            const data = await usersApi.getAll(page * pageSize, pageSize);
            setUsers(data.users);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleToggleActive = async (userId: string, currentActive: boolean) => {
        try {
            await usersApi.update(userId, { isActive: !currentActive });
            loadUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleToggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN';
        if (!confirm(`Change this user to ${newRole}?`)) return;

        try {
            await usersApi.update(userId, { role: newRole });
            loadUsers();
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            await usersApi.delete(userId);
            loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
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
                <h1 className="text-3xl font-bold text-white font-space">Users</h1>
                <p className="mt-2 text-gray-400">Manage platform users ({total} total)</p>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">User</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Role</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-300 font-medium">Joined</th>
                            <th className="px-6 py-3 text-gray-300 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-750">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#F2419C] rounded-full flex items-center justify-center text-white font-bold">
                                            {user.firstName?.[0] || user.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {user.firstName && user.lastName
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : user.email}
                                            </p>
                                            <p className="text-gray-400 text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleRole(user.id, user.role)}
                                        className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN'
                                                ? 'bg-purple-500/20 text-purple-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                            }`}
                                    >
                                        {user.role}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleActive(user.id, user.isActive)}
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {total > pageSize && (
                <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">
                        Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)} of {total}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={(page + 1) * pageSize >= total}
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
