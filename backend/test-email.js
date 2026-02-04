const nodemailer = require('nodemailer');
require('dotenv').config();

// Zoho Mail SMTP configurations
const configs = [
    {
        name: 'Zoho: smtp.zoho.com Port 465 SSL',
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },
    {
        name: 'Zoho: smtp.zoho.com Port 587 TLS',
        host: 'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },
    {
        name: 'Zoho EU: smtp.zoho.eu Port 465 SSL',
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },
    {
        name: 'Zoho IN: smtppro.zoho.in Port 465 SSL',
        host: 'smtppro.zoho.in',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },
];

async function testConfig(config) {
    console.log(`\n🔄 Testing: ${config.name}`);
    const transporter = nodemailer.createTransport({
        ...config,
        connectionTimeout: 10000,
    });

    try {
        await transporter.verify();
        console.log('✅ SUCCESS! This config works!');
        return { success: true, config };
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
        return { success: false };
    }
}

async function main() {
    console.log('Testing Hostinger SMTP configurations...');

    for (const config of configs) {
        const result = await testConfig(config);
        if (result.success) {
            console.log('\n🎉 Working configuration found!');
            console.log(JSON.stringify(result.config, null, 2));
            process.exit(0);
        }
    }

    console.log('\n❌ All configurations failed.');
    console.log('\nPlease check in Hostinger hPanel:');
    console.log('1. Go to Emails → Email Accounts → Click on your email');
    console.log('2. Look for "Configuration" or "Email Client Settings"');
    console.log('3. Note the exact SMTP server, port, and if SSL/TLS is required');
}

main();
