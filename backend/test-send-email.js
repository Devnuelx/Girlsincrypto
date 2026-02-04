const nodemailer = require('nodemailer');
require('dotenv').config();

// Zoho SMTP with app password from environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true,
});

console.log('Sending test email...\n');

transporter.sendMail({
    from: '"Girls in Crypto Hub" <Contact@girlsincryptohub.com>',
    to: 'homicedit@gmail.com',
    subject: 'SMTP Test - ' + new Date().toISOString(),
    text: 'If you receive this, your Zoho SMTP is working!',
    html: '<h1>SMTP Test Successful!</h1><p>Time: ' + new Date().toISOString() + '</p>',
}, (err, info) => {
    if (err) {
        console.log('\n❌ Email sending FAILED:');
        console.log(err);
    } else {
        console.log('\n✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        console.log('\nCheck your inbox at Contact@girlsincryptohub.com');
    }
    process.exit(0);
});
