import { MongoStorage } from './storage';

async function addAdminUser() {
  console.log('Creating admin user...');
  
  const storage = new MongoStorage();
  
  // Wait a bit for connection to establish
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getUserByName('Lorenzo', 'Lovito');
    
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        firstName: existingAdmin.firstName,
        lastName: existingAdmin.lastName,
        role: existingAdmin.role
      });
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = await storage.createUser({
      id: `admin-${Date.now()}`,
      firstName: 'Lorenzo',
      lastName: 'Lovito',
      email: 'lovitolorenzo23@gmail.com',
      phone: '',
      password: 'Yogurt25!',
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Details:', {
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      email: adminUser.email,
      role: adminUser.role
    });
    console.log('\nYou can now login with:');
    console.log('Name: Lorenzo Lovito');
    console.log('Password: Yogurt25!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

addAdminUser();
