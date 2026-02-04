import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req) {
  try {
    const { name, email, phone } = await req.json();

    // Generate unique identifier
    const uniqueId = crypto.randomUUID();

    // Construct a link (optional use case)
    const MeetingLink = `https://meet.google.com/neu-fhqd-ojd`;

    const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=GirlsInCryptoHub+First+Meetup&dates=20250704T180000Z/20250704T190000Z&details=Join+us+for+our+first+meetup!+Link:+${MeetingLink}&location=Online&sf=true&output=xml`;


let emailRes = { data: null, error: null };
if (resend) {
  emailRes = await resend.emails.send({
    from: 'GirlsInCrypto <admin@girlsincryptohub.com>',
    to: email,
    subject: "You're In Save the Date for GirlsInCryptoHub",
    text: `Hey ${name}!

  Welcome to GirlsInCryptoHub

  Our next meetup is on Aug 10th 6pm UTC!
  Add it to your calendar and prepare to chill with us!

  Meeting Link: ${MeetingLink}

  We can not wait to grow, build, and glow together!
  - The GirlsInCrypto Team`,
    html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Hey ${name}</p>
      <p>Welcome to <strong>GirlsInCryptoHub</strong></p>
      <p>Our next meetup is happening on <strong>July 30th 6pm UTC</strong> do not miss it!</p>
      <p><a href="${MeetingLink}" style="padding: 10px 15px; background-color: #e75480; color: white; border-radius: 5px; text-decoration: none;">Save to Calendar</a></p>
      <p>We can not wait to grow, build, and glow together!</p>
      <p>Love,<br>The GirlsInCryptoHub Team</p>
      <br>
      <small style="color: #999;">If you did not register for this, feel free to ignore this email.</small>
    <small style="color: #999;">Do not want emails from us? <a href="https://girlsincryptohub.com/unsubscribe?email=${email}" style="color: #e75480;">Unsubscribe here</a>.</small>
    </div>
  `,
  });
} else {
  console.warn('Resend API key not configured - skipping email');
}




    console.log('Resend Response:', emailRes);
    if (emailRes.error) {
      console.error('Resend Error:', emailRes.error);
    }

    // Send to Google Sheet (now includes uniqueId)
    await fetch('https://script.google.com/macros/s/AKfycbzzShu2JIJ6n--7iM0kd40ysyNQPxcf8Vz2TWz0lzVDLrx0FxNWGnh_YiNOHmTlY47EoQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, uniqueId }),
    });

    return NextResponse.json({ success: true, uniqueId });
  } catch (err) {
    console.error('[REGISTER_ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
