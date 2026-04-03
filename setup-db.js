// MongoDB Setup Script using Node.js
// Run with: node setup-db.js

import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://ahsaan:Pak2122@cluster0.nvxh83b.mongodb.net/Corvit%20Educator?retryWrites=true&w=majority';
const DB_NAME = 'Corvit Educator';

const client = new MongoClient(MONGODB_URI);

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB!');

    const db = client.db(DB_NAME);

    // Step 1: Create Collections
    console.log('\n📝 Creating collections...');
    const collections = [
      'admins',
      'users',
      'courses',
      'quizzes',
      'questions',
      'results',
      'chatMessages',
      'conversations',
      'auditLogs'
    ];

    for (const col of collections) {
      try {
        await db.createCollection(col);
        console.log(`  ✅ Created collection: ${col}`);
      } catch (err) {
        if (err.codeName === 'NamespaceExists') {
          console.log(`  ℹ️ Collection already exists: ${col}`);
        } else {
          throw err;
        }
      }
    }

    // Step 2: Create Indexes
    console.log('\n🔑 Creating indexes...');

    // Admins Collection Indexes
    await db.collection('admins').createIndex({ email: 1 }, { unique: true });
    await db.collection('admins').createIndex({ createdAt: -1 });
    await db.collection('admins').createIndex({ isActive: 1 });
    console.log('  ✅ Admins indexes created');

    // Users Collection Indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: -1 });
    await db.collection('users').createIndex({ role: 1 });
    console.log('  ✅ Users indexes created');

    // Courses Collection Indexes
    await db.collection('courses').createIndex({ instructor: 1 });
    await db.collection('courses').createIndex({ category: 1 });
    await db.collection('courses').createIndex({ createdAt: -1 });
    console.log('  ✅ Courses indexes created');

    // Quizzes Collection Indexes
    await db.collection('quizzes').createIndex({ courseId: 1 });
    await db.collection('quizzes').createIndex({ createdBy: 1 });
    await db.collection('quizzes').createIndex({ createdAt: -1 });
    console.log('  ✅ Quizzes indexes created');

    // Results Collection Indexes
    await db.collection('results').createIndex({ userId: 1, quizId: 1 }, { unique: true });
    await db.collection('results').createIndex({ completedAt: -1 });
    console.log('  ✅ Results indexes created');

    // Chat Messages Collection Indexes
    await db.collection('chatMessages').createIndex({ conversationId: 1, createdAt: -1 });
    await db.collection('chatMessages').createIndex({ senderId: 1 });
    console.log('  ✅ ChatMessages indexes created');

    // Conversations Collection Indexes
    await db.collection('conversations').createIndex({ participants: 1 });
    await db.collection('conversations').createIndex({ updatedAt: -1 });
    console.log('  ✅ Conversations indexes created');

    // Audit Logs Collection Indexes
    await db.collection('auditLogs').createIndex({ adminId: 1, createdAt: -1 });
    await db.collection('auditLogs').createIndex({ actionType: 1 });
    console.log('  ✅ AuditLogs indexes created');

    // Step 3: Insert Super Admin
    console.log('\n👤 Creating super admin user...');
    const adminEmail = 'ahsaan@corviteducator.com';
    
    try {
      const result = await db.collection('admins').insertOne({
        name: 'ahsaan',
        email: adminEmail,
        password: '$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX', // Placeholder - hash in production
        role: 'super_admin',
        permissions: [
          'manage_users',
          'manage_courses',
          'manage_quizzes',
          'manage_admins',
          'view_analytics',
          'export_data',
          'manage_chat',
          'manage_audit_logs'
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        department: 'Administration'
      });
      console.log(`  ✅ Super Admin created with ID: ${result.insertedId}`);
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  ℹ️ Admin already exists`);
      } else {
        throw err;
      }
    }

    // Step 4: Verify Setup
    console.log('\n📊 Verifying setup...');
    const collNames = await db.listCollections().toArray();
    const adminCount = await db.collection('admins').countDocuments();
    const usersCount = await db.collection('users').countDocuments();
    const coursesCount = await db.collection('courses').countDocuments();
    const quizzesCount = await db.collection('quizzes').countDocuments();
    const resultsCount = await db.collection('results').countDocuments();

    console.log('\n✅ DATABASE SETUP COMPLETE!');
    console.log(`Database Name: ${DB_NAME}`);
    console.log(`Collections Created: ${collNames.length}`);
    collNames.forEach(col => console.log(`  - ${col.name}`));
    console.log('\nDatabase Stats:');
    console.log(`  - Admins: ${adminCount}`);
    console.log(`  - Users: ${usersCount}`);
    console.log(`  - Courses: ${coursesCount}`);
    console.log(`  - Quizzes: ${quizzesCount}`);
    console.log(`  - Results: ${resultsCount}`);
    console.log('\n✅ Your Corvit Educator database is ready to use!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

setupDatabase();
