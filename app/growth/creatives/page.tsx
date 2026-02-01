'use client';

import { useState } from 'react';

const PLATFORMS = ['Instagram', 'TikTok', 'Email'];
const ANGLES = ['Gatekeeping', 'Secret Society', 'Lifestyle', 'Educational', 'Curiosity'];
const TONES = ['Soft', 'Confident', 'Luxury', 'Playful', 'Urgent'];
const OFFERS = ['Free Roadmap', 'Circle Invite', 'Beta Access', 'Training', 'Community'];

const HOOKS: Record<string, string[]> = {
    Gatekeeping: ["I really shouldn't be sharing this...", "This is the part they don't want you to know.", "Only 1% of women understand this."],
    "Secret Society": ["Inside our private circle, we're building something different.", "This isn't for everyone. But if you're reading this...", "Welcome to the inner circle."],
    Lifestyle: ["Here's my morning routine as someone who stopped waiting.", "A day in my life: building wealth on my own terms.", "What I wish I knew before I started."],
    Educational: ["Here's exactly how I got started — step by step.", "The 3 things every beginner needs to understand.", "Let me break this down for you."],
    Curiosity: ["What if everything you believed about money was wrong?", "I tested this for 30 days. Here's what happened.", "The one thing that changed everything."],
};

const CTA: Record<string, string[]> = {
    "Free Roadmap": ['DM me "ROADMAP" to get started.', "Link in bio → grab your free guide."],
    "Circle Invite": ['DM me "JOIN" for access.', "Link in bio → spots limited."],
    "Beta Access": ['DM "BETA" to join the waitlist.', "Only accepting 50 this round."],
    Training: ['DM "TRAIN" for the replay.', "Free training in bio."],
    Community: ['DM "COMMUNITY" to apply.', "Application takes 2 min."],
};

export default function CreativesPage() {
    const [platform, setPlatform] = useState(PLATFORMS[0]);
    const [angle, setAngle] = useState(ANGLES[0]);
    const [tone, setTone] = useState(TONES[0]);
    const [offer, setOffer] = useState(OFFERS[0]);
    const [generated, setGenerated] = useState<{ hooks: string[]; body: string; cta: string[] } | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const generate = () => {
        const bodies: Record<string, string> = {
            Soft: "I've been on this journey for a while now, and I finally found a community of women who get it.\n\nNo pressure. No hype. Just real conversations about building wealth on our own terms.",
            Confident: "Here's the truth: most women are taught to play it safe.\n\nBut the women in our circle? We're doing things differently.",
            Luxury: "There's a certain kind of woman who understands that wealth is about more than money.\n\nIt's about freedom. Options. Living by your own design.",
            Playful: "Okay but imagine having a group chat where everyone is actually smart about money 💅\n\nThat's literally what we built.",
            Urgent: "I'm only opening this to a small group right now.\n\nIf you've been waiting for the right time — this is it.",
        };
        setGenerated({ hooks: HOOKS[angle] || [], body: bodies[tone] || '', cta: CTA[offer] || [] });
    };

    const copy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">Creatives</h1>
                <p className="text-sm text-[#9B9B9B]">Generate ad & content copy</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] space-y-6">
                    <div>
                        <label className="block text-sm text-[#5C5C5C] mb-2">Platform</label>
                        <div className="flex gap-2 flex-wrap">
                            {PLATFORMS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPlatform(p)}
                                    className={`px-4 py-2 rounded-xl text-sm ${platform === p ? 'bg-[#2C2C2C] text-white' : 'bg-[#F5F3EF] text-[#5C5C5C]'}`}
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
                                    className={`px-4 py-2 rounded-xl text-sm ${angle === a ? 'bg-[#2C2C2C] text-white' : 'bg-[#F5F3EF] text-[#5C5C5C]'}`}
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
                                    className={`px-4 py-2 rounded-xl text-sm ${tone === t ? 'bg-[#2C2C2C] text-white' : 'bg-[#F5F3EF] text-[#5C5C5C]'}`}
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
                                    className={`px-4 py-2 rounded-xl text-sm ${offer === o ? 'bg-[#2C2C2C] text-white' : 'bg-[#F5F3EF] text-[#5C5C5C]'}`}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={generate} className="w-full py-3 bg-[#2C2C2C] text-white rounded-xl font-medium">
                        Generate
                    </button>
                </div>

                <div className="space-y-4">
                    {generated ? (
                        <>
                            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                                <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">Hooks</h4>
                                {generated.hooks.map((h, i) => (
                                    <div key={i} className="flex justify-between mb-2">
                                        <span className="text-sm text-[#5C5C5C]">{h}</span>
                                        <button onClick={() => copy(h, `h${i}`)} className="text-xs text-[#9B9B9B]">
                                            {copied === `h${i}` ? '✓' : 'Copy'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                                <div className="flex justify-between mb-3">
                                    <h4 className="text-sm font-medium text-[#1A1A1A]">Body</h4>
                                    <button onClick={() => copy(generated.body, 'body')} className="text-xs text-[#9B9B9B]">
                                        {copied === 'body' ? '✓' : 'Copy'}
                                    </button>
                                </div>
                                <p className="text-sm text-[#5C5C5C] whitespace-pre-line">{generated.body}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD]">
                                <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">CTA</h4>
                                {generated.cta.map((c, i) => (
                                    <div key={i} className="flex justify-between mb-2">
                                        <span className="text-sm text-[#5C5C5C]">{c}</span>
                                        <button onClick={() => copy(c, `c${i}`)} className="text-xs text-[#9B9B9B]">
                                            {copied === `c${i}` ? '✓' : 'Copy'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 border border-[#E8E4DD] text-center text-[#9B9B9B]">
                            Configure and click generate
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
