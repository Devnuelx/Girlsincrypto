'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function WaitingRoomContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const [countdown, setCountdown] = useState(5);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Show countdown before enabling the join button
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsReady(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const isFull = status === 'full';
    const isError = status === 'error';

    const handleJoinGroup = () => {
        // Redirect to rotator endpoint
        window.location.href = `${API_URL}/gich/join`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16082a] to-[#0d0015] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Animation */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#F2419C] to-[#ff6bba] rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-5xl">💕</span>
                    </div>
                    {!isFull && !isError && !isReady && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-40 h-40 border-4 border-pink-400/30 rounded-full animate-ping"></div>
                        </div>
                    )}
                </div>

                {isFull ? (
                    <>
                        <h1 className="text-3xl font-bold text-white font-space mb-4">
                            Group is Full 😕
                        </h1>
                        <p className="text-gray-400 mb-8">
                            Our current WhatsApp group has reached capacity.
                            Please check back soon — we&apos;re opening new spots daily!
                        </p>
                        <Link
                            href="/community"
                            className="inline-block px-8 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition"
                        >
                            ← Back to Community
                        </Link>
                    </>
                ) : isError ? (
                    <>
                        <h1 className="text-3xl font-bold text-white font-space mb-4">
                            Something Went Wrong
                        </h1>
                        <p className="text-gray-400 mb-8">
                            We couldn&apos;t process your request. Please try again.
                        </p>
                        <Link
                            href="/community"
                            className="inline-block px-8 py-3 bg-[#F2419C] text-white rounded-xl font-medium hover:bg-pink-500 transition"
                        >
                            Try Again
                        </Link>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-white font-space mb-4">
                            You&apos;re In! 🎉
                        </h1>
                        <p className="text-gray-400 mb-8">
                            Welcome to Girls in Crypto Hub! Click below to join our exclusive WhatsApp community.
                        </p>

                        {isReady ? (
                            <button
                                onClick={handleJoinGroup}
                                className="w-full py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-3"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Join WhatsApp Group
                            </button>
                        ) : (
                            <div className="w-full py-4 bg-gray-700 text-gray-400 rounded-xl font-bold text-lg">
                                Getting your spot ready... {countdown}s
                            </div>
                        )}

                        <p className="text-gray-500 text-sm mt-6">
                            By joining, you agree to respect community guidelines and fellow members.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function WaitingRoom() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#F2419C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <WaitingRoomContent />
        </Suspense>
    );
}
