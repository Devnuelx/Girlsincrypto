'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function SettingsPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const tenantData = {
        name: 'Girls in Crypto Hub',
        slug: 'gich',
        rotatorLink: `${API_URL}/gich/join`,
        webhookUrl: `${API_URL}/webhooks/lead-capture`,
    };

    const copyText = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Settings</h1>
                <p className="text-sm text-[#9B9B9B] mt-1">Your tenant configuration and integration links</p>
            </div>

            {/* Tenant Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-4">Tenant Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-[#9B9B9B] mb-1.5 uppercase tracking-wider">Name</label>
                        <p className="text-sm text-[#1A1A1A]">{tenantData.name}</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[#9B9B9B] mb-1.5 uppercase tracking-wider">Slug</label>
                        <p className="text-sm text-[#1A1A1A]">{tenantData.slug}</p>
                    </div>
                </div>
            </div>

            {/* Rotator Link */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">Rotator Link</h3>
                <p className="text-xs text-[#9B9B9B] mb-4">
                    Use this single link in all your ads and content. It automatically routes users to available WhatsApp groups.
                </p>
                <div className="flex items-center gap-3">
                    <code className="flex-1 px-4 py-3 bg-[#FAF9F6] rounded-xl text-sm text-[#1A1A1A] font-mono overflow-hidden text-ellipsis">
                        {tenantData.rotatorLink}
                    </code>
                    <button
                        onClick={() => copyText(tenantData.rotatorLink, 'rotator')}
                        className="px-5 py-3 bg-[#2C2C2C] text-white text-sm font-medium rounded-xl hover:bg-[#3C3C3C] transition"
                    >
                        {copied === 'rotator' ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Webhook URL */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">Webhook Endpoint</h3>
                <p className="text-xs text-[#9B9B9B] mb-4">
                    Point your landing pages and forms to this webhook to capture leads.
                </p>
                <div className="flex items-center gap-3">
                    <code className="flex-1 px-4 py-3 bg-[#FAF9F6] rounded-xl text-sm text-[#1A1A1A] font-mono overflow-hidden text-ellipsis">
                        {tenantData.webhookUrl}
                    </code>
                    <button
                        onClick={() => copyText(tenantData.webhookUrl, 'webhook')}
                        className="px-5 py-3 bg-[#2C2C2C] text-white text-sm font-medium rounded-xl hover:bg-[#3C3C3C] transition"
                    >
                        {copied === 'webhook' ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Webhook Payload */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">Webhook Payload Format</h3>
                <p className="text-xs text-[#9B9B9B] mb-4">
                    Send a POST request with this JSON structure:
                </p>
                <div className="relative">
                    <pre className="px-4 py-3 bg-[#FAF9F6] rounded-xl text-sm text-[#5C5C5C] font-mono overflow-x-auto">
                        {`{
  "tenantSlug": "gich",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "source": "landing_page"
}`}
                    </pre>
                    <button
                        onClick={() => copyText(`{
  "tenantSlug": "gich",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "source": "landing_page"
}`, 'payload')}
                        className="absolute top-3 right-3 text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition"
                    >
                        {copied === 'payload' ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <p className="text-xs text-[#9B9B9B] mt-3">
                    Valid sources: <code className="text-[#1A1A1A]">ads</code>, <code className="text-[#1A1A1A]">landing_page</code>, <code className="text-[#1A1A1A]">cold_email</code>, <code className="text-[#1A1A1A]">organic</code>
                </p>
            </div>

            {/* Quick Test */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">Quick Test</h3>
                <p className="text-xs text-[#9B9B9B] mb-4">
                    Test the rotator by clicking this link:
                </p>
                <a
                    href={tenantData.rotatorLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#2C2C2C] hover:underline"
                >
                    Open rotator link →
                </a>
            </div>
        </div>
    );
}
