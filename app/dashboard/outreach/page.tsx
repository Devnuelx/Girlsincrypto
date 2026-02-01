'use client';

import { useState } from 'react';

const COLD_EMAIL_TEMPLATES = [
    {
        name: 'Beta Invite',
        subject: 'You might be a good fit',
        body: `Hey {{name}},

I came across your profile and thought you might be a good fit for something we're building.

We're putting together a small group of women who want to learn about building wealth — no hype, no nonsense. Just real conversations and actionable strategies.

If you're interested, I'd love to share more. No pressure either way.

Let me know.`,
    },
    {
        name: 'Collab Request',
        subject: 'Quick collab idea',
        body: `Hey {{name}},

Love what you're building. Genuinely.

I run a community of women focused on financial education and I think there could be something interesting here if we connected.

Would you be open to a quick 15-min chat? No pitch, just seeing if there's alignment.

Either way, keep doing what you're doing.`,
    },
    {
        name: 'Curiosity Hook',
        subject: 'Random question for you',
        body: `Hey {{name}},

This is probably a weird email, but I'll keep it short.

Have you ever thought about joining a community of ambitious women who are quietly building wealth?

I'm not selling anything. I just think you'd vibe with the group we're building.

Happy to share more if you're curious. If not, no worries at all.`,
    },
];

const DM_TEMPLATES = [
    {
        name: 'Warm Intro',
        text: `Hey! 💕 I've been following your content for a bit and I love what you're doing.

I'm building a community of women who are learning about building wealth together — no guru vibes, just real conversations.

Thought you might be a good fit. Want me to send you more info?`,
    },
    {
        name: 'Curiosity',
        text: `Hey! Quick random question — have you ever thought about learning more about financial freedom / building wealth?

I'm part of a really dope community and honestly think you'd fit in perfectly. Lmk if you want the link 🖤`,
    },
    {
        name: 'Direct',
        text: `Hey! I know this is out of nowhere but I'm putting together a group of ambitious women who want to learn about money & wealth.

No weird sales pitch, just thought you'd be a good fit based on your content. Can I send you the link?`,
    },
];

const COMMENT_HOOKS = [
    'This is exactly what I needed today 🙌',
    'Girl you\'re speaking my language',
    'Just joined a community like this and it\'s changed everything for me',
    'The way you explained this >>> nobody does it like you',
    'I feel so seen right now 💕',
    'Saved this immediately. Thank you for sharing.',
];

export default function OutreachPage() {
    const [activeTab, setActiveTab] = useState<'email' | 'dm' | 'comments'>('email');
    const [selectedEmail, setSelectedEmail] = useState(0);
    const [selectedDm, setSelectedDm] = useState(0);
    const [copied, setCopied] = useState<string | null>(null);

    const copyText = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Outreach</h1>
                <p className="text-sm text-[#9B9B9B] mt-1">Cold email and DM templates — copy and paste into your tools</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {[
                    { key: 'email', label: 'Cold Email' },
                    { key: 'dm', label: 'DM Scripts' },
                    { key: 'comments', label: 'Comment Hooks' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === tab.key
                            ? 'bg-[#2C2C2C] text-white'
                            : 'bg-[#F5F3EF] text-[#5C5C5C] hover:bg-[#EBE8E2]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Cold Email */}
            {activeTab === 'email' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        {COLD_EMAIL_TEMPLATES.map((template, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedEmail(i)}
                                className={`w-full text-left p-4 rounded-xl transition ${selectedEmail === i
                                    ? 'bg-[#2C2C2C] text-white'
                                    : 'bg-white border border-[#E8E4DD] hover:border-[#C8C4BD]'
                                    }`}
                            >
                                <p className={`text-sm font-medium ${selectedEmail === i ? 'text-white' : 'text-[#1A1A1A]'}`}>
                                    {template.name}
                                </p>
                            </button>
                        ))}
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#9B9B9B] uppercase tracking-wider">Subject</span>
                                <button
                                    onClick={() => copyText(COLD_EMAIL_TEMPLATES[selectedEmail].subject, 'subject')}
                                    className="text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition"
                                >
                                    {copied === 'subject' ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <p className="text-sm text-[#1A1A1A]">{COLD_EMAIL_TEMPLATES[selectedEmail].subject}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#9B9B9B] uppercase tracking-wider">Body</span>
                                <button
                                    onClick={() => copyText(COLD_EMAIL_TEMPLATES[selectedEmail].body, 'email-body')}
                                    className="text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition"
                                >
                                    {copied === 'email-body' ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <pre className="text-sm text-[#5C5C5C] whitespace-pre-wrap font-sans">
                                {COLD_EMAIL_TEMPLATES[selectedEmail].body}
                            </pre>
                        </div>
                        <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#E8E4DD]">
                            <p className="text-xs text-[#9B9B9B]">
                                💡 Paste into: Instantly, SmartLead, Lemlist, or any cold email tool
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* DM Scripts */}
            {activeTab === 'dm' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        {DM_TEMPLATES.map((template, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedDm(i)}
                                className={`w-full text-left p-4 rounded-xl transition ${selectedDm === i
                                    ? 'bg-[#2C2C2C] text-white'
                                    : 'bg-white border border-[#E8E4DD] hover:border-[#C8C4BD]'
                                    }`}
                            >
                                <p className={`text-sm font-medium ${selectedDm === i ? 'text-white' : 'text-[#1A1A1A]'}`}>
                                    {template.name}
                                </p>
                            </button>
                        ))}
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#9B9B9B] uppercase tracking-wider">Script</span>
                                <button
                                    onClick={() => copyText(DM_TEMPLATES[selectedDm].text, 'dm')}
                                    className="text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition"
                                >
                                    {copied === 'dm' ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <pre className="text-sm text-[#5C5C5C] whitespace-pre-wrap font-sans">
                                {DM_TEMPLATES[selectedDm].text}
                            </pre>
                        </div>
                        <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#E8E4DD] mt-4">
                            <p className="text-xs text-[#9B9B9B]">
                                💡 Paste into: Instagram DM, ManyChat, or direct messages
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Comment Hooks */}
            {activeTab === 'comments' && (
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                    <p className="text-sm text-[#1A1A1A] font-medium mb-4">Comment hooks to start conversations</p>
                    <div className="space-y-3">
                        {COMMENT_HOOKS.map((hook, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-xl">
                                <p className="text-sm text-[#5C5C5C]">{hook}</p>
                                <button
                                    onClick={() => copyText(hook, `comment-${i}`)}
                                    className="text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition ml-4"
                                >
                                    {copied === `comment-${i}` ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#E8E4DD] mt-6">
                        <p className="text-xs text-[#9B9B9B]">
                            💡 Use these on TikTok or Instagram to start genuine conversations with potential leads
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
