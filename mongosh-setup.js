// ============================================================================
// CORVIT EDUCATOR DATABASE SETUP SCRIPT
// Run this in MongoDB Atlas Web Terminal (mongosh)
// ============================================================================

// Switch to the Corvit Educator database
use "Corvit Educator"

// ============================================================================
// STEP 1: CREATE COLLECTIONS
// ============================================================================

db.createCollection("admins");
db.createCollection("users");
db.createCollection("courses");
db.createCollection("quizzes");
db.createCollection("questions");
db.createCollection("results");
db.createCollection("chatMessages");
db.createCollection("conversations");
db.createCollection("auditLogs");

print("✅ Collections created successfully!");

// ============================================================================
// STEP 2: CREATE INDEXES
// ============================================================================

// Admins Collection Indexes
db.admins.createIndex({ email: 1 }, { unique: true });
db.admins.createIndex({ createdAt: -1 });
db.admins.createIndex({ isActive: 1 });

// Users Collection Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ role: 1 });

// Courses Collection Indexes
db.courses.createIndex({ instructor: 1 });
db.courses.createIndex({ category: 1 });
db.courses.createIndex({ createdAt: -1 });

// Quizzes Collection Indexes
db.quizzes.createIndex({ courseId: 1 });
db.quizzes.createIndex({ createdBy: 1 });
db.quizzes.createIndex({ createdAt: -1 });

// Results Collection Indexes
db.results.createIndex({ userId: 1, quizId: 1 }, { unique: true });
db.results.createIndex({ completedAt: -1 });

// Chat Messages Collection Indexes
db.chatMessages.createIndex({ conversationId: 1, createdAt: -1 });
db.chatMessages.createIndex({ senderId: 1 });

// Conversations Collection Indexes
db.conversations.createIndex({ participants: 1 });
db.conversations.createIndex({ updatedAt: -1 });

// Audit Logs Collection Indexes
db.auditLogs.createIndex({ adminId: 1, createdAt: -1 });
db.auditLogs.createIndex({ actionType: 1 });

print("✅ All indexes created successfully!");

// ============================================================================
// STEP 3: INSERT SUPER ADMIN USER
// ============================================================================

// NOTE: In production, use bcrypt to hash the password
// Default password: Pak2122 (should be hashed)
// For testing, we'll insert with a note

db.admins.insertOne({
  name: "nehmat",
  email: "nehmatullahkh@gmail.com",
  password: "$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX", // Placeholder - hash in production
  role: "super_admin",
  permissions: [
    "manage_users",
    "manage_courses",
    "manage_quizzes",
    "manage_admins",
    "view_analytics",
    "export_data",
    "manage_chat",
    "manage_audit_logs"
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  department: "Administration"
});

print("✅ Super Admin account created!");
print("Admin Email: nehmatullahkh@gmail.com");
print("Admin Name: nehmat");
print("Admin Role: super_admin");

// ============================================================================
// STEP 4: VERIFY SETUP
// ============================================================================

var stats = {
  collections: db.getCollectionNames(),
  adminCount: db.admins.countDocuments(),
  usersCount: db.users.countDocuments(),
  coursesCount: db.courses.countDocuments(),
  quizzesCount: db.quizzes.countDocuments(),
  resultsCount: db.results.countDocuments()
};

print("\n✅ DATABASE SETUP COMPLETE!");
print("Database Name: Corvit Educator");
print("Cluster: 1st");
print("\nCollections Created:", stats.collections.length);
stats.collections.forEach(col => print("  - " + col));

print("\nDatabase Stats:");
print("  - Admins: " + stats.adminCount);
print("  - Users: " + stats.usersCount);
print("  - Courses: " + stats.coursesCount);
print("  - Quizzes: " + stats.quizzesCount);
print("  - Results: " + stats.resultsCount);

print("\n✅ Your Corvit Educator database is ready to use!");
