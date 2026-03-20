import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../models/Role.js';

dotenv.config();

const defaultRoles = [
  {
    name: 'admin',
    description: 'Full system access',
    permissions: [
      'manage_users',
      'manage_roles',
      'view_reports',
      'create_post',
      'edit_post',
      'delete_post',
      'manage_eggs',
      'manage_feed',
      'manage_birds'
    ]
  },
  {
    name: 'manager',
    description: 'Manage farm operations',
    permissions: [
      'view_reports',
      'create_post',
      'edit_post',
      'manage_eggs',
      'manage_feed',
      'manage_birds'
    ]
  },
  {
    name: 'editor',
    description: 'Edit content only',
    permissions: [
      'create_post',
      'edit_post',
      'view_reports'
    ]
  },
  {
    name: 'user',
    description: 'View-only access',
    permissions: [
      'view_reports'
    ]
  }
];

async function seedRoles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const role of defaultRoles) {
      await Role.findOneAndUpdate(
        { name: role.name },
        role,
        { upsert: true, new: true }
      );
      console.log(`Role "${role.name}" seeded`);
    }

    console.log('All roles seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}

seedRoles();
