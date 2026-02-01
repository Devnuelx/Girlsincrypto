'use client';

import { useState } from 'react';

const PLATFORMS = ['Instagram', 'TikTok', 'Email'];
const ANGLES = ['Gatekeeping', 'Secret Society', 'Lifestyle Vlog', 'Educational', 'Curiosity'];
const TONES = ['Soft', 'Confident', 'Luxury', 'Playful', 'Urgent'];
const OFFERS = ['Free Roadmap', 'Circle Invite', 'Beta Access', 'Exclusive Training', 'Private Community'];

const HOOKS: Record<string, string[]> = {
    Gatekeeping: [
        'I really shouldn\'t be sharing this...',
        'This is the part they don\'t want you to know.',
        'Only 1% of women understand this about wealth.',
    ],
    'Secret Society': [
        'Inside our private circle, we\'re building something different.',
        'This isn\'t for everyone.But if you\'re reading this...',
        'Welcome to the inner circle.',
    ],
    'Lifestyle Vlog': [
        'Here\'s my morning routine as someone who stopped waiting for permission.',
        'A day in my life: building wealth on my own terms.',
        'What I wish I knew before I started my journey.',
    ],
    Educational: [
        'Here\'s exactly how I got started — step by step.',
        'The 3 things every beginner needs to understand.',
        'Let me break this down for you.',
    ],
    Curiosity: [
        'What if everything you believed about money was wrong?',
        'I tested this for 30 days. Here\'s what happened.',
        'The one thing that changed everything for me.',
    ],
};

const CTA_TEMPLATES: Record<string, string[]> = {
    'Free Roadmap': [
        'DM me "ROADMAP" to get started.',
        'Link in bio → grab your free guide.',
        'Comment "START" and I\'ll send it to you.',
    ],
    'Circle Invite': [
        'DM me "JOIN" for access.',
        'Link in bio → spots are limited.',
        'Comment "CIRCLE" to get the link.',
    ],
    'Beta Access': [
        'DM "BETA" to join the waitlist.',
        'Only accepting 50 women this round.',
        'Tap the link before we close it.',
    ],
    'Exclusive Training': [
        'DM "TRAIN" for the replay.',
        'Free training in bio — watch before it\'s gone.',
        'Comment "LEARN" for instant access.',
    ],
    'Private Community': [
        'DM "COMMUNITY" to apply.',
        'Link in bio — application takes 2 min.',
        'We\'re selective.But I think you\'d fit.',
    ],
};

export default function CreativesPage() {
    const [platform, setPlatform] = useState(PLATFORMS[0]);
    const [angle, setAngle] = useState(ANGLES[0]);
    const [tone, setTone] = useState(TONES[0]);
    const [offer, setOffer] = useState(OFFERS[0]);
    const [generated, setGenerated] = useState<{
        hooks: string[];
        body: string;
        cta: string[];
        visual: string;
    } | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const generate = () => {
        const hooks = HOOKS[angle] || HOOKS['Gatekeeping'];
        const ctas = CTA_TEMPLATES[offer] || CTA_TEMPLATES['Circle Invite'];

        const bodyTemplates: Record<string, string> = {
            Soft: `I've been on this journey for a while now, and I finally found a community of women who get it.\n\nNo pressure. No hype. Just real conversations about building wealth on our own terms.\n\nIf this resonates with you, I'd love to have you.`,
            Confident: `Here's the truth: most women are taught to play it safe.\n\nBut the women in our circle? We're doing things differently.\n\nWe're learning, building, and supporting each other — without asking for permission.`,
            Luxury: `There's a certain kind of woman who understands that wealth is about more than money.\n\nIt's about freedom. Options. Living life by your own design.\n\nThis community was built for women who think that way.`,
            Playful: `Okay but imagine having a group chat where everyone is actually smart about money 💅\n\nThat's literally what we built and I'm obsessed with it.\n\nNo weird bro energy. Just us figuring things out together.`,
            Urgent: `I'm only opening this to a small group right now.\n\nIf you've been waiting for the right time to start — this is it.\n\nSpots are filling fast and I don't want you to miss this.`,
        };

        const visualTemplates: Record<string, string> = {
            Instagram: 'Clean, minimal carousel. Soft beige/cream tones. Text overlay on first slide. Face on last slide for connection.',
            TikTok: 'Talking head with soft lighting. Green screen or aesthetic background. Trending sound or original audio.',
            Email: 'Plain text. Personal tone. Short paragraphs. One clear CTA link.',
        };

        setGenerated({
            hooks,
            body: bodyTemplates[tone] || bodyTemplates['Soft'],
            cta: ctas,
            visual: visualTemplates[platform] || visualTemplates['Instagram'],
        });
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
                <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Creatives</h1>
                <p className="text-sm text-[#9B9B9B] mt-1">Generate copy for ads and organic content</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] space-y-6">
                    <h3 className="text-sm font-medium text-[#1A1A1A]">Configure</h3>

                    <div>
                        <label className="block text-sm text-[#5C5C5C] mb-2">Platform</label>
                        <div className="flex gap-2 flex-wrap">
                            {PLATFORMS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPlatform(p)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${platform === p
                                        ? 'bg-[#2C2C2C] text-white'
                                        : 'bg-[#F5F3EF] text-[#5C5C5C] hover:bg-[#EBE8E2]'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-[#5C5C5C] mb-2">Angle</label>
                        <div className="flex gap-2 flex-wrap">
                            {ANGLES.map(a => (
                                <button
                                    key={a}
                                    onClick={() => setAngle(a)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${angle === a
                                        ? 'bg-[#2C2C2C] text-white'
                                        : 'bg-[#F5F3EF] text-[#5C5C5C] hover:bg-[#EBE8E2]'
                                        }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-[#5C5C5C] mb-2">Tone</label>
                        <div className="flex gap-2 flex-wrap">
                            {TONES.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tone === t
                                        ? 'bg-[#2C2C2C] text-white'
                                        : 'bg-[#F5F3EF] text-[#5C5C5C] hover:bg-[#EBE8E2]'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-[#5C5C5C] mb-2">Offer</label>
                        <div className="flex gap-2 flex-wrap">
                            {OFFERS.map(o => (
                                <button
                                    key={o}
                                    onClick={() => setOffer(o)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${offer === o
                                        ? 'bg-[#2C2C2C] text-white'
                                        : 'bg-[#F5F3EF] text-[#5C5C5C] hover:bg-[#EBE8E2]'
                                        }`}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        className="w-full py-3 bg-[#2C2C2C] text-white rounded-xl font-medium hover:bg-[#3C3C3C] transition"
                    >
                        Generate Creative
                    </button>
                </div>

                {/* Output */}
                <div className="space-y-4">
                    {generated ? (
                        <>
                            {/* Hooks */}
                            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                                <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">Hooks</h4>
                                <div className="space-y-2">
                                    {generated.hooks.map((hook, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <p className="flex-1 text-sm text-[#5C5C5C]">{hook}</p>
                                            <button
                                                onClick={() => copyText(hook, `hook-${i}`)}
                                                className="text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition"
                                            >
                                                {copied === `hook-${i}` ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-[#1A1A1A]">Body</h4>
                                    <button
                                        onClick={() => copyText(generated.body, 'body')}
                                        className="text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition"
                                    >
                                        {copied === 'body' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <p className="text-sm text-[#5C5C5C] whitespace-pre-line">{generated.body}</p>
                            </div>

                            {/* CTAs */}
                            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                                <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">Call to Action</h4>
                                <div className="space-y-2">
                                    {generated.cta.map((cta, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <p className="flex-1 text-sm text-[#5C5C5C]">{cta}</p>
                                            <button
                                                onClick={() => copyText(cta, `cta-${i}`)}
                                                className="text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition"
                                            >
                                                {copied === `cta-${i}` ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Visual Direction */}
                            <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-[#E8E4DD]">
                                <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">Visual Direction</h4>
                                <p className="text-sm text-[#5C5C5C]">{generated.visual}</p>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 border border-[#E8E4DD] text-center">
                            <p className="text-[#9B9B9B]">Configure your settings and click generate</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
