import User from './models/user.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('Super Admin already exists:', existingSuperAdmin.email);
      return;
    }

    const hashedPassword = await bcrypt.hash('superadmin', 10);
    
    const superAdmin = new User({
      name: 'Super Admin',
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'super_admin'
    });

    await superAdmin.save();
    console.log('Super Admin created successfully:', superAdmin.email);
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

createSuperAdmin();
