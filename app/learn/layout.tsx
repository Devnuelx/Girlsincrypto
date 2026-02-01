'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

const navItems = [
    { href: '/learn', label: 'Dashboard', icon: '🏠' },
    { href: '/learn/courses', label: 'My Courses', icon: '📚' },
];

export default function LearnLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout, isAdmin } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16082a] to-[#0d0015]">
                {/* Top Navigation */}
                <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href="/learn" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#F2419C] to-[#ff6bba] rounded-full flex items-center justify-center text-white font-bold">
                                G
                            </div>
                            <div>
                                <p className="font-semibold text-white">Girls in Crypto Hub</p>
                                <p className="text-xs text-gray-400">Learning Portal</p>
                            </div>
                        </Link>

                        <nav className="flex items-center gap-6">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/learn' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 text-sm transition ${isActive ? 'text-[#F2419C]' : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-4">
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-xs text-gray-500 hover:text-gray-300 transition"
                                >
                                    Admin →
                                </Link>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-[#F2419C] to-[#ff6bba] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {user?.firstName?.[0] || 'U'}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-white text-sm">{user?.firstName || 'Student'}</p>
                                    <button
                                        onClick={logout}
                                        className="text-xs text-gray-500 hover:text-gray-300 transition"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
