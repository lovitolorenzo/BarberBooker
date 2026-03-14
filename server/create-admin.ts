import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI!);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('barbershop');
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ 
      firstName: 'Lorenzo', 
      lastName: 'Lovito' 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin);
      return;
    }
    
    // Create new admin user
    const adminUser = {
      id: `admin-${Date.now()}`,
      firstName: 'Lorenzo',
      lastName: 'Lovito',
      email: 'lovitolorenzo23@gmail.com',
      phone: '',
      password: 'Yogurt25!',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await usersCollection.insertOne(adminUser);
    console.log('Admin user created successfully:', result.insertedId);
    console.log('User details:', {
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      email: adminUser.email,
      role: adminUser.role
    });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

createAdminUser()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
