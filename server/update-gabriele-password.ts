import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Lorenzo:8uj9BMu62JUkUOLt@cluster0.6om5lbq.mongodb.net/barbershop";

async function updateGabrielePassword() {
  console.log('Updating Gabriele password...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('barbershop');
    const usersCollection = db.collection('users');
    
    // Update Gabriele's password
    const result = await usersCollection.updateOne(
      { firstName: 'Gabriele', lastName: 'Di Laurenza' },
      { $set: { password: 'Barber2026!' } }
    );
    
    if (result.matchedCount === 0) {
      console.log('Gabriele user not found, creating new one...');
      
      const newUser = {
        id: `admin-${Date.now()}`,
        firstName: 'Gabriele',
        lastName: 'Di Laurenza',
        email: 'gabriele.dilaurenza@gmail.com',
        phone: '',
        password: 'Barber2026!',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(newUser);
      console.log('✅ Gabriele admin user created with new password!');
    } else {
      console.log('✅ Gabriele password updated successfully!');
    }
    
    console.log('\nLogin credentials:');
    console.log('Name: Gabriele Di Laurenza');
    console.log('Password: Barber2026!');
    
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

updateGabrielePassword();
