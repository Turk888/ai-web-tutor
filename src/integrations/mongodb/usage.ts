// MongoDB Integration Usage Guide
// Practical examples for using MongoDB with Corvit Educator

import type {
  Admin,
  User,
  Course,
  Quiz,
  Result,
  ChatMessage,
  Conversation,
  AuditLog,
} from './types';
import { COLLECTIONS, mongodbConfig } from './index';

/**
 * IMPORTANT: This is a frontend React application.
 * 
 * For security and best practices, MongoDB operations should be performed
 * through backend API endpoints, NOT directly from the client.
 * 
 * The MongoDB client configuration is provided for reference and backend
 * API server development.
 */

// ============================================================================
// BACKEND API EXAMPLES (Use these patterns in your backend)
// ============================================================================

/**
 * Example 1: Admin Login Endpoint
 * Backend: POST /api/admin/login
 * 
 * Request Body:
 * {
 *   email: "admin@corviteducator.com",
 *   password: "password123"
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   token: "jwt-token",
 *   admin: {
 *     _id: "...",
 *     name: "Super Admin",
 *     email: "admin@corviteducator.com",
 *     role: "super_admin"
 *   }
 * }
 */

/**
 * Example 2: Create New Admin
 * Backend: POST /api/admin/create (requires super_admin role)
 * 
 * Request Body:
 * {
 *   name: "John Doe",
 *   email: "john@corviteducator.com",
 *   password: "securePassword123",
 *   role: "admin",
 *   permissions: ["manage_users", "manage_courses"],
 *   phone: "+1234567890"
 * }
 */

/**
 * Example 3: Register New User
 * Backend: POST /api/user/register
 * 
 * Request Body:
 * {
 *   firstName: "Jane",
 *   lastName: "Smith",
 *   email: "jane@example.com",
 *   password: "securePassword123",
 *   role: "student",
 *   phone: "+9876543210"
 * }
 */

/**
 * Example 4: Log Admin Action
 * Backend: Internal audit logging
 * 
 * Insert into auditLogs collection:
 * {
 *   adminId: ObjectId("..."),
 *   action: "Created new user account",
 *   description: "Admin created user account for John Doe",
 *   actionType: "create",
 *   targetCollection: "users",
 *   targetId: ObjectId("..."),
 *   changes: {
 *     name: "John Doe",
 *     email: "john@example.com"
 *   },
 *   ipAddress: "192.168.1.1",
 *   userAgent: "Mozilla/5.0...",
 *   createdAt: new Date()
 * }
 */

// ============================================================================
// FRONTEND API CALL EXAMPLES
// ============================================================================

/**
 * Example: Admin Login from React Component
 * 
 * import { useState } from 'react';
 * 
 * function LoginForm() {
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 *   const [loading, setLoading] = useState(false);
 *   const [error, setError] = useState('');
 * 
 *   const handleLogin = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     setLoading(true);
 *     setError('');
 * 
 *     try {
 *       const response = await fetch('/api/admin/login', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({ email, password })
 *       });
 * 
 *       const data = await response.json();
 * 
 *       if (data.success) {
 *         // Store token (consider using secure cookies)
 *         localStorage.setItem('adminToken', data.token);
 *         // Redirect to admin dashboard
 *         window.location.href = '/admin/dashboard';
 *       } else {
 *         setError(data.message || 'Login failed');
 *       }
 *     } catch (err) {
 *       setError('Network error. Please try again.');
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 * 
 *   return (
 *     <form onSubmit={handleLogin}>
 *       <input
 *         type="email"
 *         value={email}
 *         onChange={(e) => setEmail(e.target.value)}
 *         placeholder="Admin Email"
 *         required
 *       />
 *       <input
 *         type="password"
 *         value={password}
 *         onChange={(e) => setPassword(e.target.value)}
 *         placeholder="Password"
 *         required
 *       />
 *       <button type="submit" disabled={loading}>
 *         {loading ? 'Logging in...' : 'Login'}
 *       </button>
 *       {error && <p style={{ color: 'red' }}>{error}</p>}
 *     </form>
 *   );
 * }
 */

// ============================================================================
// TYPESCRIPT TYPES FOR API RESPONSES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface LoginResponse extends ApiResponse {
  data?: {
    token: string;
    admin: Admin;
  };
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'moderator';
  permissions: string[];
  phone?: string;
  department?: string;
}

export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'parent';
  phone?: string;
}

// ============================================================================
// USEFUL DATABASE QUERIES (MongoDB)
// ============================================================================

/**
 * Find admin by email
 * db.admins.findOne({ email: "admin@example.com" })
 */

/**
 * Find all active admin users
 * db.admins.find({ isActive: true })
 */

/**
 * Update admin last login
 * db.admins.updateOne(
 *   { _id: ObjectId("...") },
 *   { $set: { lastLogin: new Date() } }
 * )
 */

/**
 * Get all courses by instructor
 * db.courses.find({ instructor: ObjectId("...") })
 */

/**
 * Get quiz results for a user
 * db.results.find({ userId: ObjectId("...") })
 *   .sort({ completedAt: -1 })
 *   .limit(10)
 */

/**
 * Get chat history between users
 * db.chatMessages.find({
 *   conversationId: ObjectId("..."),
 *   isDeleted: false
 * }).sort({ createdAt: 1 })
 */

/**
 * Get admin audit logs
 * db.auditLogs.find({
 *   adminId: ObjectId("..."),
 *   createdAt: {
 *     $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
 *   }
 * }).sort({ createdAt: -1 })
 */

/**
 * Calculate average quiz score per course
 * db.results.aggregate([
 *   {
 *     $lookup: {
 *       from: "quizzes",
 *       localField: "quizId",
 *       foreignField: "_id",
 *       as: "quiz"
 *     }
 *   },
 *   {
 *     $group: {
 *       _id: "$quiz.courseId",
 *       averageScore: { $avg: "$percentage" },
 *       totalAttempts: { $sum: 1 }
 *     }
 *   }
 * ])
 */

// ============================================================================
// COLLECTION NAMES (Use these in your application)
// ============================================================================

export const collectionNames = {
  admins: COLLECTIONS.ADMINS,
  users: COLLECTIONS.USERS,
  courses: COLLECTIONS.COURSES,
  quizzes: COLLECTIONS.QUIZZES,
  questions: COLLECTIONS.QUESTIONS,
  results: COLLECTIONS.RESULTS,
  chatMessages: COLLECTIONS.CHAT_MESSAGES,
  conversations: COLLECTIONS.CONVERSATIONS,
  auditLogs: COLLECTIONS.AUDIT_LOGS,
};

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

export const dbConfig = mongodbConfig;
// dbConfig.uri = MongoDB connection string
// dbConfig.dbName = "Corvit Educator"

export default {
  collectionNames,
  dbConfig,
};
