// MongoDB Database Setup Guide
// Instructions and scripts for creating the Corvit Educator database

/**
 * MONGODB ATLAS SETUP INSTRUCTIONS
 * 
 * Database: Corvit Educator
 * Connection String: mongodb+srv://nehmat:Pak2122@1st.tagscjg.mongodb.net/Corvit%20Educator?retryWrites=true&w=majority
 * 
 * The following instructions will set up all required collections and indexes.
 */

// ============================================================================
// STEP 1: Create Collections
// ============================================================================
// Execute in MongoDB Atlas Data Services or mongosh terminal

/*
// Connect using mongosh
mongosh "mongodb+srv://nehma:Pak2122@1st.tagscjg.mongodb.net/Corvit Educator"

// Create collections
db.createCollection("admins");
db.createCollection("users");
db.createCollection("courses");
db.createCollection("quizzes");
db.createCollection("questions");
db.createCollection("results");
db.createCollection("chatMessages");
db.createCollection("conversations");
db.createCollection("auditLogs");
*/

// ============================================================================
// STEP 2: Create Indexes
// ============================================================================
// Admins Collection Indexes
/*
db.admins.createIndex({ email: 1 }, { unique: true });
db.admins.createIndex({ createdAt: -1 });
db.admins.createIndex({ isActive: 1 });
*/

// Users Collection Indexes
/*
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ role: 1 });
*/

// Courses Collection Indexes
/*
db.courses.createIndex({ instructor: 1 });
db.courses.createIndex({ category: 1 });
db.courses.createIndex({ createdAt: -1 });
*/

// Quizzes Collection Indexes
/*
db.quizzes.createIndex({ courseId: 1 });
db.quizzes.createIndex({ createdBy: 1 });
db.quizzes.createIndex({ createdAt: -1 });
*/

// Results Collection Indexes
/*
db.results.createIndex({ userId: 1, quizId: 1 }, { unique: true });
db.results.createIndex({ completedAt: -1 });
*/

// Chat Messages Collection Indexes
/*
db.chatMessages.createIndex({ conversationId: 1, createdAt: -1 });
db.chatMessages.createIndex({ senderId: 1 });
*/

// Conversations Collection Indexes
/*
db.conversations.createIndex({ participants: 1 });
db.conversations.createIndex({ updatedAt: -1 });
*/

// Audit Logs Collection Indexes
/*
db.auditLogs.createIndex({ adminId: 1, createdAt: -1 });
db.auditLogs.createIndex({ actionType: 1 });
*/

// ============================================================================
// STEP 3: Insert Sample Admin Document (Optional)
// ============================================================================
// Insert a super admin user for testing

/*
use "Corvit Educator"

db.admins.insertOne({
  name: "Super Admin",
  email: "admin@corviteducator.com",
  password: "$2a$12$...", // Use bcrypt hashed password
  role: "super_admin",
  permissions: [
    "manage_users",
    "manage_courses",
    "manage_quizzes",
    "manage_admins",
    "view_analytics",
    "export_data"
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  phone: "+1234567890",
  department: "Administration"
});
*/

// ============================================================================
// STEP 4: Verify Collections and Indexes
// ============================================================================
// Run these commands to verify setup

/*
// List all collections
db.getCollectionNames();

// View indexes for each collection
db.admins.getIndexes();
db.users.getIndexes();
db.courses.getIndexes();
db.quizzes.getIndexes();
db.results.getIndexes();
db.chatMessages.getIndexes();
db.conversations.getIndexes();
db.auditLogs.getIndexes();

// Count documents in each collection
db.admins.countDocuments();
db.users.countDocuments();
db.courses.countDocuments();
db.quizzes.countDocuments();
db.results.countDocuments();
db.chatMessages.countDocuments();
db.conversations.countDocuments();
db.auditLogs.countDocuments();
*/

// ============================================================================
// BACKUP: Complete Setup Script (Run all at once)
// ============================================================================
// This is a complete setup script that can be run in mongosh

export const setupDatabaseScript = `
use "Corvit Educator"

// Create collections
db.createCollection("admins");
db.createCollection("users");
db.createCollection("courses");
db.createCollection("quizzes");
db.createCollection("questions");
db.createCollection("results");
db.createCollection("chatMessages");
db.createCollection("conversations");
db.createCollection("auditLogs");

// Admins Indexes
db.admins.createIndex({ email: 1 }, { unique: true });
db.admins.createIndex({ createdAt: -1 });
db.admins.createIndex({ isActive: 1 });

// Users Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ role: 1 });

// Courses Indexes
db.courses.createIndex({ instructor: 1 });
db.courses.createIndex({ category: 1 });
db.courses.createIndex({ createdAt: -1 });

// Quizzes Indexes
db.quizzes.createIndex({ courseId: 1 });
db.quizzes.createIndex({ createdBy: 1 });
db.quizzes.createIndex({ createdAt: -1 });

// Results Indexes
db.results.createIndex({ userId: 1, quizId: 1 }, { unique: true });
db.results.createIndex({ completedAt: -1 });

// Chat Messages Indexes
db.chatMessages.createIndex({ conversationId: 1, createdAt: -1 });
db.chatMessages.createIndex({ senderId: 1 });

// Conversations Indexes
db.conversations.createIndex({ participants: 1 });
db.conversations.createIndex({ updatedAt: -1 });

// Audit Logs Indexes
db.auditLogs.createIndex({ adminId: 1, createdAt: -1 });
db.auditLogs.createIndex({ actionType: 1 });
`;

// ============================================================================
// ADVANCED: Data Validation Rules (JSON Schema)
// ============================================================================
// Optional: Set up JSON schema validation for collections

export const schemaValidation = {
  admins: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "name",
        "email",
        "password",
        "role",
        "permissions",
        "createdAt",
        "updatedAt",
        "isActive",
      ],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
        password: { bsonType: "string" },
        role: { enum: ["super_admin", "admin", "moderator"] },
        permissions: { bsonType: "array", items: { bsonType: "string" } },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        lastLogin: { bsonType: "date" },
        isActive: { bsonType: "bool" },
        phone: { bsonType: "string" },
        department: { bsonType: "string" },
      },
    },
  },
};

// ============================================================================
// NOTES FOR DEVELOPERS
// ============================================================================
/**
 * 1. MONGODB CONNECTION:
 *    - Use the connection string from .env file
 *    - Credentials: nehma / Pak2122
 *    - Database: Corvit Educator
 * 
 * 2. PASSWORD HASHING:
 *    - Always hash passwords before storing
 *    - Recommended: bcrypt (npm install bcrypt)
 *    - Never store plain text passwords
 * 
 * 3. AUTHENTICATION:
 *    - Implement JWT tokens for session management
 *    - Use secure HTTP-only cookies for token storage
 *    - Implement password reset functionality
 * 
 * 4. BACKUP:
 *    - Enable MongoDB Atlas automated backups
 *    - Test recovery procedures regularly
 * 
 * 5. MONITORING:
 *    - Set up alerts for unusual activity
 *    - Monitor performance and storage usage
 * 
 * 6. SECURITY:
 *    - Use role-based access control (RBAC)
 *    - Implement field-level encryption for sensitive data
 *    - Keep dependencies updated
 *    - Use environment variables for secrets
 */

export default setupDatabaseScript;
