import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Lorenzo:8uj9BMu62JUkUOLt@cluster0.6om5lbq.mongodb.net/barbershop";

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', uri);
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
  });
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    const db = client.db('barbershop');
    const collections = await db.listCollections().toArray();
    console.log('Database:', db.databaseName);
    console.log('Collections:', collections.map(c => c.name));
    
    // Try to count users
    const usersCount = await db.collection('users').countDocuments();
    console.log('Users count:', usersCount);
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testConnection();
