'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function CommunityPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Submit lead to backend
            await fetch(`${API_URL}/webhooks/lead-capture`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantSlug: 'gich',
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    source: 'landing_page',
                }),
            });

            // Redirect to waiting room
            router.push('/waiting-room');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16082a] to-[#0d0015] text-white">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <span>💕</span>
                            <span>Join 5,000+ Women in Crypto</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-6 leading-tight">
                            Master <span className="text-[#F2419C]">Crypto</span>
                            <br />With Your Community
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Join Girls in Crypto Hub — the #1 community for women learning blockchain, trading, and DeFi.
                            No fluff, just real knowledge from women who get it.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 text-gray-300">
                                <span className="text-pink-400">✓</span> Expert-led courses
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <span className="text-pink-400">✓</span> Active WhatsApp community
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <span className="text-pink-400">✓</span> Weekly live sessions
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                        <h2 className="text-2xl font-bold mb-2">Join the Community 👑</h2>
                        <p className="text-gray-400 mb-6">Get instant access to our WhatsApp group</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Queen Bee"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="queen@email.com"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 234 567 8900"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none transition"
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-[#F2419C] to-[#ff6bba] text-white rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'Joining...' : 'Join Now — It\'s Free! 🚀'}
                            </button>
                        </form>

                        <p className="text-center text-gray-500 text-sm mt-6">
                            By joining, you agree to our community guidelines.
                        </p>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-white/10 py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-gray-400 mb-6">Trusted by women from</p>
                    <div className="flex flex-wrap justify-center gap-8 text-gray-500">
                        <span>🏢 Fortune 500</span>
                        <span>🎓 Harvard</span>
                        <span>💼 Goldman Sachs</span>
                        <span>🌍 70+ Countries</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
