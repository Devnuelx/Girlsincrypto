const { MongoClient } = require('mongodb');

// Test MongoDB connection
async function testConnection() {
    // Using MongoDB Atlas free tier test database
    const uri = "mongodb+srv://gichtest:testpassword123@cluster0.mongodb.net/gich_test?retryWrites=true&w=majority";

    console.log('🔍 Testing MongoDB connection...\n');

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');

        const db = client.db('gich_test');
        const collections = await db.listCollections().toArray();

        console.log(`\n📊 Database: gich_test`);
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
            message: 'MongoDB migration test successful'
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
