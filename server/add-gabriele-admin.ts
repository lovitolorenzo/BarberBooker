import { MongoStorage } from './storage';

async function addGabrieleAdmin() {
  console.log('Creating Gabriele admin user...');
  
  const storage = new MongoStorage();
  
  // Wait a bit for connection to establish
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getUserByName('Gabriele', 'Di Laurenza');
    
    if (existingAdmin) {
      console.log('Gabriele admin user already exists:', {
        firstName: existingAdmin.firstName,
        lastName: existingAdmin.lastName,
        role: existingAdmin.role
      });
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = await storage.createUser({
      id: `admin-${Date.now()}`,
      firstName: 'Gabriele',
      lastName: 'Di Laurenza',
      email: 'gabriele.dilaurenza@gmail.com',
      phone: '',
      password: 'Barber2026!',
      role: 'admin'
    });
    
    console.log('✅ Gabriele admin user created successfully!');
    console.log('Details:', {
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      email: adminUser.email,
      role: adminUser.role
    });
    console.log('\nYou can now login with:');
    console.log('Name: Gabriele Di Laurenza');
    console.log('Password: Admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating Gabriele admin user:', error);
    process.exit(1);
  }
}

addGabrieleAdmin();
