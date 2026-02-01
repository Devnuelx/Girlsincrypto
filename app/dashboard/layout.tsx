'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '◎' },
    { href: '/dashboard/whatsapp-groups', label: 'WhatsApp', icon: '◉' },
    { href: '/dashboard/leads', label: 'Leads', icon: '◇' },
    { href: '/dashboard/traffic', label: 'Traffic', icon: '◈' },
    { href: '/dashboard/creatives', label: 'Creatives', icon: '✦' },
    { href: '/dashboard/outreach', label: 'Outreach', icon: '◌' },
    { href: '/dashboard/import', label: 'Import', icon: '↑' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute requireAdmin>
            <div className="min-h-screen bg-[#FAF9F6] flex">
                {/* Sidebar */}
                <aside className="w-64 bg-[#FFFEFA] border-r border-[#E8E4DD] flex flex-col">
                    <div className="p-6 border-b border-[#E8E4DD]">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#2C2C2C] rounded-full flex items-center justify-center text-[#FAF9F6] font-serif text-lg">
                                G
                            </div>
                            <div>
                                <p className="font-semibold text-[#1A1A1A] text-sm tracking-wide">GICH</p>
                                <p className="text-xs text-[#9B9B9B] tracking-wider">CONTROL PANEL</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4">
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${isActive
                                                    ? 'bg-[#2C2C2C] text-[#FAF9F6]'
                                                    : 'text-[#5C5C5C] hover:bg-[#F5F3EF] hover:text-[#2C2C2C]'
                                                }`}
                                        >
                                            <span className="text-base">{item.icon}</span>
                                            <span className="font-medium tracking-wide">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-[#E8E4DD]">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-[#D4A574] to-[#B8956A] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user?.firstName?.[0] || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#1A1A1A] text-sm truncate">
                                    {user?.firstName || 'Admin'}
                                </p>
                                <p className="text-xs text-[#9B9B9B] truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full px-4 py-2 text-sm text-[#9B9B9B] hover:text-[#2C2C2C] transition text-left"
                        >
                            Sign out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-6xl mx-auto p-8">{children}</div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
