'use client';

import { useState } from 'react';

const EMAILS = [
    { name: 'Beta Invite', subject: 'You might be a good fit', body: `Hey {{name}},\n\nI came across your profile and thought you might be a good fit for something we're building.\n\nWe're putting together a small group of women who want to learn about building wealth — no hype, no nonsense.\n\nLet me know if you're interested.` },
    { name: 'Collab', subject: 'Quick collab idea', body: `Hey {{name}},\n\nLove what you're building. Genuinely.\n\nI run a community of women focused on financial education and I think there could be something interesting here.\n\nWould you be open to a 15-min chat?` },
];

const DMS = [
    { name: 'Warm', text: `Hey! 💕 I've been following your content and I love it.\n\nI'm building a community of women learning about wealth together — no guru vibes.\n\nThought you might be a good fit. Want more info?` },
    { name: 'Curiosity', text: `Hey! Quick question — have you thought about learning more about financial freedom?\n\nI'm part of a really dope community and I think you'd fit perfectly. Lmk if you want the link 🖤` },
];

const COMMENTS = ['This is exactly what I needed 🙌', 'Girl you\'re speaking my language', 'Just joined a community like this and it\'s changed everything', 'The way you explained this >>> nobody does it like you', 'Saved this immediately ✨'];

export default function OutreachPage() {
    const [tab, setTab] = useState<'email' | 'dm' | 'comments'>('email');
    const [emailIdx, setEmailIdx] = useState(0);
    const [dmIdx, setDmIdx] = useState(0);
    const [copied, setCopied] = useState<string | null>(null);

    const copy = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };

    return (
        <div className="space-y-8">
            <div><h1 className="text-2xl font-semibold text-[#1A1A1A]">Outreach</h1><p className="text-sm text-[#9B9B9B]">Cold email & DM templates</p></div>
            <div className="flex gap-2">{[{ key: 'email', label: 'Cold Email' }, { key: 'dm', label: 'DM Scripts' }, { key: 'comments', label: 'Comments' }].map(t => <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-5 py-2.5 rounded-xl text-sm font-medium ${tab === t.key ? 'bg-[#2C2C2C] text-white' : 'bg-[#F5F3EF] text-[#5C5C5C]'}`}>{t.label}</button>)}</div>

            {tab === 'email' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="space-y-2">{EMAILS.map((e, i) => <button key={i} onClick={() => setEmailIdx(i)} className={`w-full text-left p-4 rounded-xl ${emailIdx === i ? 'bg-[#2C2C2C] text-white' : 'bg-white border border-[#E8E4DD]'}`}>{e.name}</button>)}</div>
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]"><div className="flex justify-between mb-2"><span className="text-xs text-[#9B9B9B] uppercase">Subject</span><button onClick={() => copy(EMAILS[emailIdx].subject, 'subj')} className="text-xs text-[#9B9B9B]">{copied === 'subj' ? '✓' : 'Copy'}</button></div><p className="text-sm text-[#1A1A1A]">{EMAILS[emailIdx].subject}</p></div>
                        <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]"><div className="flex justify-between mb-2"><span className="text-xs text-[#9B9B9B] uppercase">Body</span><button onClick={() => copy(EMAILS[emailIdx].body, 'body')} className="text-xs text-[#9B9B9B]">{copied === 'body' ? '✓' : 'Copy'}</button></div><pre className="text-sm text-[#5C5C5C] whitespace-pre-wrap font-sans">{EMAILS[emailIdx].body}</pre></div>
                        <div className="bg-[#FAF9F6] rounded-xl p-4"><p className="text-xs text-[#9B9B9B]">💡 Paste into: Instantly, SmartLead, Lemlist</p></div>
                    </div>
                </div>
            )}

            {tab === 'dm' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="space-y-2">{DMS.map((d, i) => <button key={i} onClick={() => setDmIdx(i)} className={`w-full text-left p-4 rounded-xl ${dmIdx === i ? 'bg-[#2C2C2C] text-white' : 'bg-white border border-[#E8E4DD]'}`}>{d.name}</button>)}</div>
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]"><div className="flex justify-between mb-3"><span className="text-xs text-[#9B9B9B] uppercase">Script</span><button onClick={() => copy(DMS[dmIdx].text, 'dm')} className="text-xs text-[#9B9B9B]">{copied === 'dm' ? '✓' : 'Copy'}</button></div><pre className="text-sm text-[#5C5C5C] whitespace-pre-wrap font-sans">{DMS[dmIdx].text}</pre></div>
                    </div>
                </div>
            )}

            {tab === 'comments' && (
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                    <p className="text-sm text-[#1A1A1A] font-medium mb-4">Comment hooks</p>
                    {COMMENTS.map((c, i) => <div key={i} className="flex justify-between p-4 bg-[#FAF9F6] rounded-xl mb-2"><span className="text-sm text-[#5C5C5C]">{c}</span><button onClick={() => copy(c, `c${i}`)} className="text-xs text-[#9B9B9B]">{copied === `c${i}` ? '✓' : 'Copy'}</button></div>)}
                </div>
            )}
        </div>
    );
}
