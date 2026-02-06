'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { paymentsApi } from '../../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface TierInfo {
    tier: string;
    price: number;
    name: string;
    description: string;
}

const TIER_FEATURES: Record<string, string[]> = {
    HEIRESS: [
        'Access to Heiress-level courses',
        'Personalized learning schedule',
        'Progress tracking',
        'Community access',
    ],
    EMPRESS: [
        'Everything in Heiress',
        'Access to Empress-level courses',
        'Advanced trading strategies',
        'Priority support',
    ],
    SOVEREIGN: [
        'Everything in Empress',
        'Access to ALL courses',
        'Exclusive masterclasses',
        '1-on-1 mentorship sessions',
        'Lifetime updates',
    ],
};

const TIER_COLORS: Record<string, { bg: string; accent: string; badge: string }> = {
    HEIRESS: {
        bg: 'from-pink-400 to-pink-600',
        accent: 'border-pink-400',
        badge: 'bg-pink-100 text-pink-700',
    },
    EMPRESS: {
        bg: 'from-purple-500 to-purple-700',
        accent: 'border-purple-400',
        badge: 'bg-purple-100 text-purple-700',
    },
    SOVEREIGN: {
        bg: 'from-amber-400 to-amber-600',
        accent: 'border-amber-400',
        badge: 'bg-amber-100 text-amber-700',
    },
};

export default function PricingPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [tiers, setTiers] = useState<TierInfo[]>([]);
    const [userTiers, setUserTiers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

    const loadTiers = useCallback(async () => {
        try {
            const tierData = await paymentsApi.getTiers();
            setTiers(tierData);

            if (isAuthenticated) {
                const myTiers = await paymentsApi.getMyTiers();
                setUserTiers(myTiers.purchasedTiers || []);
            }
        } catch (error) {
            console.error('Failed to load tiers:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadTiers();
    }, [loadTiers]);

    const handlePurchase = async (tier: string) => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/pricing');
            return;
        }

        setCheckoutLoading(tier);
        try {
            const result = await paymentsApi.createTierCheckout(tier);
            if (result.link) {
                window.location.href = result.link;
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            alert((error as Error).message);
        } finally {
            setCheckoutLoading(null);
        }
    };

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen bg-[#fcfdf2] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdf2] py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <Link href="/" className="text-[#F2419C] hover:underline text-sm mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-space mb-4">
                        Choose Your Path 👑
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Unlock your crypto journey with the tier that fits your goals.
                        Higher tiers include access to all lower tier content.
                    </p>
                </div>

                {/* Tier Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier, index) => {
                        const owned = userTiers.includes(tier.tier);
                        const colors = TIER_COLORS[tier.tier] || TIER_COLORS.HEIRESS;
                        const features = TIER_FEATURES[tier.tier] || [];
                        const isMiddle = index === 1;

                        return (
                            <div
                                key={tier.tier}
                                className={`relative bg-white rounded-3xl overflow-hidden shadow-xl transition hover:shadow-2xl ${isMiddle ? 'md:-mt-4 md:mb-4 ring-2 ring-[#F2419C]' : ''
                                    }`}
                            >
                                {isMiddle && (
                                    <div className="absolute top-0 left-0 right-0 bg-[#F2419C] text-white text-center py-2 text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}

                                {/* Tier Header */}
                                <div className={`bg-gradient-to-br ${colors.bg} p-8 pt-12 text-white text-center`}>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.badge} mb-4`}>
                                        {tier.tier}
                                    </span>
                                    <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                                    <div className="text-4xl font-bold mb-2">
                                        ${tier.price}
                                        <span className="text-lg font-normal opacity-80"> one-time</span>
                                    </div>
                                    <p className="text-sm opacity-90">{tier.description}</p>
                                </div>

                                {/* Features */}
                                <div className="p-8">
                                    <ul className="space-y-4 mb-8">
                                        {features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="text-[#F2419C] mt-0.5">✓</span>
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {owned ? (
                                        <div className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-semibold text-center">
                                            ✓ Owned
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handlePurchase(tier.tier)}
                                            disabled={checkoutLoading === tier.tier}
                                            className={`w-full py-3 rounded-xl font-semibold transition ${isMiddle
                                                    ? 'bg-[#F2419C] text-white hover:bg-pink-500'
                                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                } disabled:opacity-50`}
                                        >
                                            {checkoutLoading === tier.tier ? 'Loading...' : `Get ${tier.tier}`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ / Info */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500">
                        Questions? <a href="mailto:hello@girlsincryptohub.com" className="text-[#F2419C] hover:underline">Contact us</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
