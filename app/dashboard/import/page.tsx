'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<Array<Record<string, string>>>([]);
    const [mapping, setMapping] = useState({
        name: '',
        email: '',
        phone: '',
        source: '',
    });
    const [headers, setHeaders] = useState<string[]>([]);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setResult(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim());

            if (lines.length < 2) {
                alert('CSV must have at least a header row and one data row');
                return;
            }

            const csvHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            setHeaders(csvHeaders);

            const rows = lines.slice(1, 6).map(line => {
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                const row: Record<string, string> = {};
                csvHeaders.forEach((header, i) => {
                    row[header] = values[i] || '';
                });
                return row;
            });

            setPreview(rows);

            // Auto-detect mappings
            const lowerHeaders = csvHeaders.map(h => h.toLowerCase());
            setMapping({
                name: csvHeaders[lowerHeaders.findIndex(h => h.includes('name'))] || '',
                email: csvHeaders[lowerHeaders.findIndex(h => h.includes('email'))] || '',
                phone: csvHeaders[lowerHeaders.findIndex(h => h.includes('phone') || h.includes('mobile'))] || '',
                source: csvHeaders[lowerHeaders.findIndex(h => h.includes('source'))] || '',
            });
        };
        reader.readAsText(selectedFile);
    };

    const handleImport = async () => {
        if (!file) return;
        setImporting(true);

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target?.result as string;
                const lines = text.split('\n').filter(l => l.trim());
                const csvHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

                let success = 0;
                let failed = 0;

                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                    const row: Record<string, string> = {};
                    csvHeaders.forEach((header, j) => {
                        row[header] = values[j] || '';
                    });

                    const lead = {
                        tenantSlug: 'gich',
                        name: mapping.name ? row[mapping.name] : undefined,
                        email: mapping.email ? row[mapping.email] : undefined,
                        phone: mapping.phone ? row[mapping.phone] : undefined,
                        source: 'organic',
                    };

                    try {
                        await fetch(`${API_URL}/webhooks/lead-capture`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(lead),
                        });
                        success++;
                    } catch {
                        failed++;
                    }
                }

                setResult({ success, failed });
                setImporting(false);
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('Import failed:', error);
            setImporting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Import Leads</h1>
                <p className="text-sm text-[#9B9B9B] mt-1">Upload CSV files from external scrapers or lists</p>
            </div>

            {/* Upload */}
            <div className="bg-white rounded-2xl p-8 border border-[#E8E4DD]">
                <div className="border-2 border-dashed border-[#E8E4DD] rounded-xl p-12 text-center">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label
                        htmlFor="csv-upload"
                        className="cursor-pointer block"
                    >
                        <div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">↑</span>
                        </div>
                        <p className="text-sm text-[#1A1A1A] font-medium">
                            {file ? file.name : 'Click to upload CSV'}
                        </p>
                        <p className="text-xs text-[#9B9B9B] mt-1">
                            {file ? `${preview.length}+ rows detected` : 'or drag and drop'}
                        </p>
                    </label>
                </div>
            </div>

            {/* Preview & Mapping */}
            {preview.length > 0 && (
                <>
                    <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                        <h3 className="text-sm font-medium text-[#1A1A1A] mb-4">Map Fields</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {['name', 'email', 'phone', 'source'].map(field => (
                                <div key={field}>
                                    <label className="block text-xs text-[#9B9B9B] mb-1.5 uppercase tracking-wider">
                                        {field}
                                    </label>
                                    <select
                                        value={(mapping as any)[field]}
                                        onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg bg-[#FAF9F6] border border-[#E8E4DD] text-sm text-[#1A1A1A] focus:outline-none"
                                    >
                                        <option value="">— Skip —</option>
                                        {headers.map(h => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                        <h3 className="text-sm font-medium text-[#1A1A1A] mb-4">Preview (first 5 rows)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#FAF9F6]">
                                        {headers.slice(0, 5).map(h => (
                                            <th key={h} className="text-left px-4 py-2 text-xs text-[#9B9B9B] uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E8E4DD]">
                                    {preview.map((row, i) => (
                                        <tr key={i}>
                                            {headers.slice(0, 5).map(h => (
                                                <td key={h} className="px-4 py-2 text-[#5C5C5C]">
                                                    {row[h] || '—'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={importing}
                        className="w-full py-4 bg-[#2C2C2C] text-white rounded-xl font-medium disabled:opacity-50 transition"
                    >
                        {importing ? 'Importing...' : 'Import Leads'}
                    </button>
                </>
            )}

            {/* Result */}
            {result && (
                <div className="bg-[#E8F5E8] rounded-2xl p-6 border border-[#C8E5C8]">
                    <p className="text-sm text-[#4A7C4A]">
                        ✓ Successfully imported {result.success} leads
                        {result.failed > 0 && ` (${result.failed} failed)`}
                    </p>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-[#E8E4DD]">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">How this works</h3>
                <ul className="text-sm text-[#5C5C5C] space-y-1.5">
                    <li>• Export leads from your scraper (Apollo, Phantombuster, etc.)</li>
                    <li>• Upload the CSV here</li>
                    <li>• Map the columns to our fields</li>
                    <li>• Leads will be imported and tracked in your funnel</li>
                </ul>
            </div>
        </div>
    );
}
