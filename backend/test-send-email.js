const nodemailer = require('nodemailer');

// Zoho SMTP with app password
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: 'Contact@girlsincryptohub.com',
        pass: 'mBWr3yDm5UKg',
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
