'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<Record<string, string>[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState({ name: '', email: '', phone: '' });
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setResult(null);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const lines = (ev.target?.result as string).split('\n').filter(l => l.trim());
            if (lines.length < 2) return;
            const h = lines[0].split(',').map(x => x.trim().replace(/"/g, ''));
            setHeaders(h);
            const rows = lines.slice(1, 6).map(l => {
                const vals = l.split(',').map(v => v.trim().replace(/"/g, ''));
                return Object.fromEntries(h.map((header, i) => [header, vals[i] || '']));
            });
            setPreview(rows);
            const lh = h.map(x => x.toLowerCase());
            setMapping({ name: h[lh.findIndex(x => x.includes('name'))] || '', email: h[lh.findIndex(x => x.includes('email'))] || '', phone: h[lh.findIndex(x => x.includes('phone'))] || '' });
        };
        reader.readAsText(f);
    };

    const handleImport = async () => {
        if (!file) return;
        setImporting(true);
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const lines = (ev.target?.result as string).split('\n').filter(l => l.trim());
            const h = lines[0].split(',').map(x => x.trim().replace(/"/g, ''));
            let success = 0, failed = 0;
            for (let i = 1; i < lines.length; i++) {
                const vals = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                const row = Object.fromEntries(h.map((header, j) => [header, vals[j] || '']));
                try {
                    await fetch(`${API_URL}/webhooks/lead-capture`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenantSlug: 'gich', name: mapping.name ? row[mapping.name] : undefined, email: mapping.email ? row[mapping.email] : undefined, phone: mapping.phone ? row[mapping.phone] : undefined, source: 'organic' }) });
                    success++;
                } catch { failed++; }
            }
            setResult({ success, failed });
            setImporting(false);
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8">
            <div><h1 className="text-2xl font-semibold text-[#1A1A1A]">Import Leads</h1><p className="text-sm text-[#9B9B9B]">Upload CSV from scrapers</p></div>
            <div className="bg-white rounded-2xl p-8 border border-[#E8E4DD]">
                <div className="border-2 border-dashed border-[#E8E4DD] rounded-xl p-12 text-center"><input type="file" accept=".csv" onChange={handleFile} className="hidden" id="csv" /><label htmlFor="csv" className="cursor-pointer"><div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">↑</div><p className="text-sm text-[#1A1A1A] font-medium">{file ? file.name : 'Click to upload CSV'}</p></label></div>
            </div>
            {preview.length > 0 && (
                <>
                    <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                        <h3 className="text-sm font-medium text-[#1A1A1A] mb-4">Map Fields</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {['name', 'email', 'phone'].map(f => (
                                <div key={f}><label className="block text-xs text-[#9B9B9B] mb-1.5 uppercase">{f}</label><select value={(mapping as any)[f]} onChange={e => setMapping({ ...mapping, [f]: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#FAF9F6] border border-[#E8E4DD] text-sm"><option value="">— Skip —</option>{headers.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleImport} disabled={importing} className="w-full py-4 bg-[#2C2C2C] text-white rounded-xl font-medium disabled:opacity-50">{importing ? 'Importing...' : 'Import Leads'}</button>
                </>
            )}
            {result && <div className="bg-[#E8F5E8] rounded-2xl p-6 border border-[#C8E5C8]"><p className="text-sm text-[#4A7C4A]">✓ Imported {result.success} leads{result.failed > 0 && ` (${result.failed} failed)`}</p></div>}
        </div>
    );
}
