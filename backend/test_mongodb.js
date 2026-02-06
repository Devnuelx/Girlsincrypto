/**
 * Test MongoDB connection
 * Uses DATABASE_URL from .env file
 * Run with: node test_mongodb.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = process.env.DATABASE_URL;

    if (!uri) {
        console.error('❌ DATABASE_URL is not set in .env file');
        process.exit(1);
    }

    console.log('🔍 Testing MongoDB connection...\n');

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');

        // Parse database name from URI
        const dbName = uri.split('/').pop().split('?')[0] || 'gich';
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();

        console.log(`\n📊 Database: ${dbName}`);
        console.log(`📁 Collections: ${collections.length}`);

        if (collections.length > 0) {
            console.log('\nExisting collections:');
            collections.forEach(col => console.log(`  - ${col.name}`));
        }

        // Test write operation
        const testCollection = db.collection('connection_test');
        await testCollection.insertOne({
            test: true,
            timestamp: new Date(),
            message: 'MongoDB connection test successful'
        });
        console.log('\n✅ Write test successful');

        // Clean up test document
        await testCollection.deleteOne({ test: true });

        console.log('\n🎉 All tests passed! MongoDB is ready to use.');

    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check your MongoDB Atlas cluster is running');
        console.error('2. Verify IP whitelist includes your IP');
        console.error('3. Confirm username/password are correct');
        console.error('4. Check network connectivity');
    } finally {
        await client.close();
    }
}

testConnection();
