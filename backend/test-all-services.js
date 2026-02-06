/**
 * Test script to verify all services are working
 * Run with: node test-all-services.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================
// 1. DATABASE TEST
// ============================================
async function testDatabase() {
    log('blue', '\n========================================');
    log('blue', '  TESTING DATABASE CONNECTION');
    log('blue', '========================================\n');

    const uri = process.env.DATABASE_URL;

    if (!uri) {
        log('red', '❌ DATABASE_URL is not set in .env');
        return false;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        log('green', '✅ Successfully connected to MongoDB!');

        // Parse database name from URI
        const dbName = uri.split('/').pop().split('?')[0] || 'gich';
        const db = client.db(dbName);

        // List collections
        const collections = await db.listCollections().toArray();
        log('green', `📊 Database: ${dbName}`);
        log('green', `📁 Collections found: ${collections.length}`);

        if (collections.length > 0) {
            console.log('\n   Collections:');
            collections.forEach(col => console.log(`   - ${col.name}`));
        }

        // Test write/read
        const testCollection = db.collection('_connection_test');
        const testDoc = { test: true, timestamp: new Date() };
        await testCollection.insertOne(testDoc);
        await testCollection.deleteOne({ test: true });
        log('green', '\n✅ Read/Write operations successful');

        return true;
    } catch (error) {
        log('red', `❌ Database connection failed: ${error.message}`);
        return false;
    } finally {
        await client.close();
    }
}

// ============================================
// 2. SMTP EMAIL TEST
// ============================================
async function testSMTP() {
    log('blue', '\n========================================');
    log('blue', '  TESTING SMTP EMAIL');
    log('blue', '========================================\n');

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        log('red', '❌ SMTP configuration incomplete in .env');
        log('yellow', `   SMTP_HOST: ${host ? '✓' : '✗'}`);
        log('yellow', `   SMTP_PORT: ${port ? '✓' : '✗'}`);
        log('yellow', `   SMTP_USER: ${user ? '✓' : '✗'}`);
        log('yellow', `   SMTP_PASS: ${pass ? '✓' : '✗'}`);
        return false;
    }

    console.log(`   Host: ${host}`);
    console.log(`   Port: ${port}`);
    console.log(`   User: ${user}`);

    const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: { user, pass },
        connectionTimeout: 10000,
    });

    try {
        await transporter.verify();
        log('green', '\n✅ SMTP connection verified successfully!');
        log('green', '   Email service is ready to send emails');
        return true;
    } catch (error) {
        log('red', `\n❌ SMTP verification failed: ${error.message}`);
        log('yellow', '\n   Troubleshooting tips:');
        log('yellow', '   1. Check if email/password are correct');
        log('yellow', '   2. Verify SMTP settings with your email provider');
        log('yellow', '   3. Some providers require "App Passwords" for SMTP');
        return false;
    }
}

// ============================================
// 3. STRIPE TEST
// ============================================
async function testStripe() {
    log('blue', '\n========================================');
    log('blue', '  TESTING STRIPE CONFIGURATION');
    log('blue', '========================================\n');

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey || secretKey.includes('REPLACE')) {
        log('red', '❌ STRIPE_SECRET_KEY is not configured');
        log('yellow', '\n   To fix:');
        log('yellow', '   1. Go to https://dashboard.stripe.com/apikeys');
        log('yellow', '   2. Copy your Secret Key');
        log('yellow', '   3. Add it to .env as STRIPE_SECRET_KEY');
        return false;
    }

    if (!webhookSecret || webhookSecret.includes('REPLACE')) {
        log('yellow', '⚠️  STRIPE_WEBHOOK_SECRET is not configured');
        log('yellow', '   Webhooks won\'t work until configured');
    }

    try {
        const Stripe = require('stripe');
        const stripe = new Stripe(secretKey);

        // Test API connection
        const balance = await stripe.balance.retrieve();
        log('green', '✅ Stripe API connection successful!');
        log('green', `   Mode: ${secretKey.startsWith('sk_live') ? 'LIVE' : 'TEST'}`);
        return true;
    } catch (error) {
        log('red', `❌ Stripe API test failed: ${error.message}`);
        return false;
    }
}

// ============================================
// 4. FLUTTERWAVE TEST
// ============================================
async function testFlutterwave() {
    log('blue', '\n========================================');
    log('blue', '  TESTING FLUTTERWAVE CONFIGURATION');
    log('blue', '========================================\n');

    const publicKey = process.env.FLW_PUBLIC_KEY;
    const secretKey = process.env.FLW_SECRET_KEY;

    if (!publicKey || !secretKey) {
        log('red', '❌ Flutterwave keys not configured');
        return false;
    }

    console.log(`   Public Key: ${publicKey.substring(0, 20)}...`);
    console.log(`   Secret Key: ${secretKey.substring(0, 20)}...`);

    try {
        const Flutterwave = require('flutterwave-node-v3');
        const flw = new Flutterwave(publicKey, secretKey);

        // Test by getting banks (a read-only operation)
        const response = await flw.Bank.country({ country: 'NG' });

        if (response.status === 'success') {
            log('green', '\n✅ Flutterwave API connection successful!');
            return true;
        } else {
            log('yellow', '\n⚠️  Flutterwave connection succeeded but returned unexpected status');
            return true;
        }
    } catch (error) {
        log('red', `\n❌ Flutterwave test failed: ${error.message}`);
        return false;
    }
}

// ============================================
// 5. ENVIRONMENT VARIABLES CHECK
// ============================================
function checkEnvVariables() {
    log('blue', '\n========================================');
    log('blue', '  ENVIRONMENT VARIABLES CHECK');
    log('blue', '========================================\n');

    const required = [
        'DATABASE_URL',
        'JWT_SECRET',
        'PORT',
        'FRONTEND_URL',
        'BACKEND_URL',
    ];

    const optional = [
        'JWT_EXPIRES_IN',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'FLW_PUBLIC_KEY',
        'FLW_SECRET_KEY',
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
    ];

    let allRequired = true;

    console.log('Required variables:');
    for (const key of required) {
        const value = process.env[key];
        if (value) {
            log('green', `   ✅ ${key}`);
        } else {
            log('red', `   ❌ ${key} - MISSING`);
            allRequired = false;
        }
    }

    console.log('\nOptional variables:');
    for (const key of optional) {
        const value = process.env[key];
        if (value && !value.includes('REPLACE')) {
            log('green', `   ✅ ${key}`);
        } else {
            log('yellow', `   ⚠️  ${key} - Not configured`);
        }
    }

    return allRequired;
}

// ============================================
// RUN ALL TESTS
// ============================================
async function runAllTests() {
    console.log('\n');
    log('blue', '╔═══════════════════════════════════════════╗');
    log('blue', '║     GICH SERVICES CONNECTIVITY TEST       ║');
    log('blue', '╚═══════════════════════════════════════════╝');

    const results = {
        env: checkEnvVariables(),
        database: await testDatabase(),
        smtp: await testSMTP(),
        stripe: await testStripe(),
        flutterwave: await testFlutterwave(),
    };

    // Summary
    log('blue', '\n========================================');
    log('blue', '  TEST SUMMARY');
    log('blue', '========================================\n');

    const statusIcon = (passed) => passed ? '✅' : '❌';

    console.log(`   ${statusIcon(results.env)} Environment Variables`);
    console.log(`   ${statusIcon(results.database)} Database (MongoDB)`);
    console.log(`   ${statusIcon(results.smtp)} Email (SMTP)`);
    console.log(`   ${statusIcon(results.stripe)} Stripe Payments`);
    console.log(`   ${statusIcon(results.flutterwave)} Flutterwave Payments`);

    const passed = Object.values(results).filter(r => r).length;
    const total = Object.values(results).length;

    console.log(`\n   Total: ${passed}/${total} services ready`);

    if (passed === total) {
        log('green', '\n🎉 All services are configured and ready!');
    } else {
        log('yellow', '\n⚠️  Some services need attention. Check the details above.');
    }

    process.exit(passed === total ? 0 : 1);
}

runAllTests().catch(console.error);
