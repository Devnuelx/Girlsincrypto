/**
 * Test SMTP configuration with multiple Zoho endpoints
 * Uses SMTP credentials from .env file
 * Run with: node test-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!user || !pass) {
    console.error('❌ SMTP_USER and SMTP_PASS must be set in .env');
    process.exit(1);
}

// Zoho Mail SMTP configurations to test
const configs = [
    {
        name: 'Zoho: smtp.zoho.com Port 465 SSL',
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: { user, pass },
    },
    {
        name: 'Zoho: smtp.zoho.com Port 587 TLS',
        host: 'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: { user, pass },
    },
    {
        name: 'Zoho EU: smtp.zoho.eu Port 465 SSL',
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: { user, pass },
    },
    {
        name: 'Zoho IN: smtppro.zoho.in Port 465 SSL',
        host: 'smtppro.zoho.in',
        port: 465,
        secure: true,
        auth: { user, pass },
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
        return { success: true, config: { ...config, auth: { user: config.auth.user, pass: '***HIDDEN***' } } };
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
        return { success: false };
    }
}

async function main() {
    console.log('Testing Zoho SMTP configurations...');
    console.log(`User: ${user}`);

    for (const config of configs) {
        const result = await testConfig(config);
        if (result.success) {
            console.log('\n🎉 Working configuration found!');
            console.log(JSON.stringify(result.config, null, 2));
            process.exit(0);
        }
    }

    console.log('\n❌ All configurations failed.');
    console.log('\nPlease check:');
    console.log('1. SMTP_USER and SMTP_PASS are correct in .env');
    console.log('2. Your Zoho account has SMTP access enabled');
    console.log('3. You may need to generate an App Password in Zoho');
}

main();
