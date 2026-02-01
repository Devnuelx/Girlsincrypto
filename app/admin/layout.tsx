'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

const adminNavItems = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/courses', label: 'Courses', icon: '📚' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute requireAdmin>
            <div className="min-h-screen bg-gray-900 flex">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 flex flex-col">
                    <div className="p-6 border-b border-gray-700">
                        <Link href="/admin" className="flex items-center gap-2">
                            <span className="text-2xl">👑</span>
                            <div>
                                <span className="font-bold text-[#F2419C] font-space block">GICH</span>
                                <span className="text-xs text-gray-400">Course Admin</span>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {adminNavItems.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                                    ? 'bg-[#F2419C] text-white font-medium'
                                                    : 'text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Switch Panels */}
                    <div className="p-4 border-t border-gray-700">
                        <p className="text-xs text-gray-500 px-4 mb-2">SWITCH TO</p>
                        <Link
                            href="/growth"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                        >
                            <span>◎</span> Growth Engine
                        </Link>
                        <Link
                            href="/learn"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                        >
                            <span>📖</span> Student View
                        </Link>
                    </div>

                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-10 h-10 bg-[#F2419C] rounded-full flex items-center justify-center text-white font-bold">
                                {user?.firstName?.[0] || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">
                                    {user?.firstName || 'Admin'}
                                </p>
                                <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full mt-2 px-4 py-2 text-sm text-gray-400 hover:text-[#F2419C] hover:bg-gray-700 rounded-lg transition text-left"
                        >
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-8">{children}</div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
