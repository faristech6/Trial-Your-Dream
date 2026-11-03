
import { connectDB, closeDB } from '../config/db.js';

async function main() {
  try {
    console.log('Connecting to MongoDB...');

    const db = await connectDB();

    const collection = db.collection('app_metadata');

    await collection.updateOne(
      { key: 'database_setup' },
      {
        $set: {
          project: 'Trial Your Dream',
          status: 'CONNECTED',
          lastCheckedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    const result = await collection.findOne({
      key: 'database_setup'
    });

    console.log('MongoDB connection successful!');
    console.log('Database:', db.databaseName);
    console.log('Collection: app_metadata');
    console.log('Saved document:', result);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

main();
