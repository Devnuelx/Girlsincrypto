/**
 * Test SMTP email sending
 * Uses SMTP credentials from .env file
 * Run with: node test-send-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !user || !pass) {
    console.error('❌ SMTP configuration incomplete in .env');
    console.error(`   SMTP_HOST: ${host ? '✓' : '✗'}`);
    console.error(`   SMTP_PORT: ${port ? '✓' : '✗'}`);
    console.error(`   SMTP_USER: ${user ? '✓' : '✗'}`);
    console.error(`   SMTP_PASS: ${pass ? '✓' : '✗'}`);
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure: parseInt(port) === 465,
    auth: { user, pass },
    debug: true,
    logger: true,
});

console.log('Sending test email...\n');
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   User: ${user}`);

transporter.sendMail({
    from: `"Girls in Crypto Hub" <${user}>`,
    to: user, // Send to self for testing
    subject: 'SMTP Test - ' + new Date().toISOString(),
    text: 'If you receive this, your SMTP is working!',
    html: '<h1>SMTP Test Successful!</h1><p>Time: ' + new Date().toISOString() + '</p>',
}, (err, info) => {
    if (err) {
        console.log('\n❌ Email sending FAILED:');
        console.log(err);
    } else {
        console.log('\n✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    }
    process.exit(0);
});
