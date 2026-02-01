'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function SettingsPage() {
    const [copied, setCopied] = useState<string | null>(null);
    const data = { name: 'Girls in Crypto Hub', slug: 'gich', rotator: `${API_URL}/gich/join`, webhook: `${API_URL}/webhooks/lead-capture` };

    const copy = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };

    return (
        <div className="space-y-8">
            <div><h1 className="text-2xl font-semibold text-[#1A1A1A]">Settings</h1><p className="text-sm text-[#9B9B9B]">Tenant config & integration links</p></div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-4">Tenant Info</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-xs text-[#9B9B9B] mb-1.5 uppercase">Name</label><p className="text-sm text-[#1A1A1A]">{data.name}</p></div>
                    <div><label className="block text-xs text-[#9B9B9B] mb-1.5 uppercase">Slug</label><p className="text-sm text-[#1A1A1A]">{data.slug}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">Rotator Link</h3>
                <p className="text-xs text-[#9B9B9B] mb-4">Use this in all ads — auto-routes to available WhatsApp groups</p>
                <div className="flex items-center gap-3"><code className="flex-1 px-4 py-3 bg-[#FAF9F6] rounded-xl text-sm font-mono overflow-hidden text-ellipsis">{data.rotator}</code><button onClick={() => copy(data.rotator, 'rotator')} className="px-5 py-3 bg-[#2C2C2C] text-white text-sm font-medium rounded-xl">{copied === 'rotator' ? '✓ Copied' : 'Copy'}</button></div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">Webhook URL</h3>
                <p className="text-xs text-[#9B9B9B] mb-4">Point landing pages here to capture leads</p>
                <div className="flex items-center gap-3"><code className="flex-1 px-4 py-3 bg-[#FAF9F6] rounded-xl text-sm font-mono overflow-hidden text-ellipsis">{data.webhook}</code><button onClick={() => copy(data.webhook, 'webhook')} className="px-5 py-3 bg-[#2C2C2C] text-white text-sm font-medium rounded-xl">{copied === 'webhook' ? '✓ Copied' : 'Copy'}</button></div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">Webhook Payload</h3>
                <pre className="px-4 py-3 bg-[#FAF9F6] rounded-xl text-sm text-[#5C5C5C] font-mono overflow-x-auto">{`{
  "tenantSlug": "gich",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "source": "landing_page"
}`}</pre>
            </div>
        </div>
    );
}
