// MongoDB Schema Types for Corvit Educator Database

import { ObjectId } from 'mongodb';

// Admin Document Type
export interface Admin {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string; // Should be hashed in production
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  phone?: string;
  department?: string;
}

// User Document Type
export interface User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Should be hashed in production
  role: 'student' | 'instructor' | 'parent';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  profileImage?: string;
  phone?: string;
}

// Course Document Type
export interface Course {
  _id?: ObjectId;
  title: string;
  description: string;
  instructor: ObjectId; // Reference to User._id
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  students: ObjectId[]; // Array of User._id
  thumbnail?: string;
}

// Quiz Document Type
export interface Quiz {
  _id?: ObjectId;
  courseId: ObjectId; // Reference to Course._id
  title: string;
  description: string;
  totalQuestions: number;
  passingScore: number;
  timeLimit?: number; // in minutes
  createdBy: ObjectId; // Reference to Admin._id or User._id
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  questions: Question[];
}

// Question Document Type for Quiz
export interface Question {
  _id?: ObjectId;
  quizId: ObjectId;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
  createdAt: Date;
}

// Result Document Type
export interface Result {
  _id?: ObjectId;
  userId: ObjectId; // Reference to User._id
  quizId: ObjectId; // Reference to Quiz._id
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number; // in seconds
  answers: UserAnswer[];
}

// User Answer for Quiz Result
export interface UserAnswer {
  questionId: ObjectId;
  userAnswer: string | string[];
  isCorrect: boolean;
  points: number;
}

// Chat Message Document Type
export interface ChatMessage {
  _id?: ObjectId;
  conversationId: ObjectId; // Reference to Conversation._id
  senderId: ObjectId; // Reference to User._id
  message: string;
  messageType: 'text' | 'code' | 'image' | 'file';
  attachments?: string[]; // URLs or file paths
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// Conversation Document Type
export interface Conversation {
  _id?: ObjectId;
  participants: ObjectId[]; // Array of User._id
  title: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Audit Log Document Type
export interface AuditLog {
  _id?: ObjectId;
  adminId: ObjectId; // Reference to Admin._id
  action: string;
  description: string;
  actionType: 'create' | 'update' | 'delete' | 'login' | 'export';
  targetCollection: string;
  targetId?: ObjectId;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Database Indexes Configuration
export const mongoDBIndexes = {
  admin: [
    { key: { email: 1 }, options: { unique: true } },
    { key: { createdAt: -1 } },
    { key: { isActive: 1 } },
  ],
  user: [
    { key: { email: 1 }, options: { unique: true } },
    { key: { createdAt: -1 } },
    { key: { role: 1 } },
  ],
  course: [
    { key: { instructor: 1 } },
    { key: { category: 1 } },
    { key: { createdAt: -1 } },
  ],
  quiz: [
    { key: { courseId: 1 } },
    { key: { createdBy: 1 } },
    { key: { createdAt: -1 } },
  ],
  result: [
    { key: { userId: 1, quizId: 1 }, options: { unique: true } },
    { key: { completedAt: -1 } },
  ],
  chatMessage: [
    { key: { conversationId: 1, createdAt: -1 } },
    { key: { senderId: 1 } },
  ],
  conversation: [
    { key: { participants: 1 } },
    { key: { updatedAt: -1 } },
  ],
  auditLog: [
    { key: { adminId: 1, createdAt: -1 } },
    { key: { actionType: 1 } },
  ],
};
