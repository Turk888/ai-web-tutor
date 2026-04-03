// MongoDB Collections Configuration for Corvit Educator Database
// This file defines the collection names and basic operations

import type { 
  Admin, 
  User, 
  Course, 
  Quiz, 
  Result, 
  ChatMessage, 
  Conversation, 
  AuditLog 
} from './types';

export const COLLECTIONS = {
  ADMINS: 'admins',
  USERS: 'users',
  COURSES: 'courses',
  QUIZZES: 'quizzes',
  QUESTIONS: 'questions',
  RESULTS: 'results',
  CHAT_MESSAGES: 'chatMessages',
  CONVERSATIONS: 'conversations',
  AUDIT_LOGS: 'auditLogs',
} as const;

// Collection schemas for reference
export const collectionSchemas = {
  [COLLECTIONS.ADMINS]: {
    name: COLLECTIONS.ADMINS,
    description: 'Admin users with super_admin, admin, or moderator roles',
    fields: [
      { name: '_id', type: 'ObjectId', required: true },
      { name: 'name', type: 'String', required: true },
      { name: 'email', type: 'String', required: true, unique: true },
      { name: 'password', type: 'String', required: true },
      { name: 'role', type: 'String', enum: ['super_admin', 'admin', 'moderator'], required: true },
      { name: 'permissions', type: 'Array', required: true },
      { name: 'createdAt', type: 'Date', required: true },
      { name: 'updatedAt', type: 'Date', required: true },
      { name: 'lastLogin', type: 'Date' },
      { name: 'isActive', type: 'Boolean', required: true, default: true },
      { name: 'phone', type: 'String' },
      { name: 'department', type: 'String' },
    ],
  },
  [COLLECTIONS.USERS]: {
    name: COLLECTIONS.USERS,
    description: 'Students, instructors, and parents',
    fields: [
      { name: '_id', type: 'ObjectId', required: true },
      { name: 'firstName', type: 'String', required: true },
      { name: 'lastName', type: 'String', required: true },
      { name: 'email', type: 'String', required: true, unique: true },
      { name: 'password', type: 'String', required: true },
      { name: 'role', type: 'String', enum: ['student', 'instructor', 'parent'], required: true },
      { name: 'createdAt', type: 'Date', required: true },
      { name: 'updatedAt', type: 'Date', required: true },
      { name: 'lastLogin', type: 'Date' },
      { name: 'isActive', type: 'Boolean', required: true, default: true },
      { name: 'profileImage', type: 'String' },
      { name: 'phone', type: 'String' },
    ],
  },
  [COLLECTIONS.COURSES]: {
    name: COLLECTIONS.COURSES,
    description: 'Educational courses',
    fields: [
      { name: '_id', type: 'ObjectId', required: true },
      { name: 'title', type: 'String', required: true },
      { name: 'description', type: 'String', required: true },
      { name: 'instructor', type: 'ObjectId', required: true, ref: COLLECTIONS.USERS },
      { name: 'category', type: 'String', required: true },
      { name: 'level', type: 'String', enum: ['beginner', 'intermediate', 'advanced'], required: true },
      { name: 'createdAt', type: 'Date', required: true },
      { name: 'updatedAt', type: 'Date', required: true },
      { name: 'isActive', type: 'Boolean', required: true, default: true },
      { name: 'students', type: 'Array', required: true },
      { name: 'thumbnail', type: 'String' },
    ],
  },
  [COLLECTIONS.QUIZZES]: {
    name: COLLECTIONS.QUIZZES,
    description: 'Quiz questions and configurations',
    fields: [
      { name: '_id', type: 'ObjectId', required: true },
      { name: 'courseId', type: 'ObjectId', required: true, ref: COLLECTIONS.COURSES },
      { name: 'title', type: 'String', required: true },
      { name: 'description', type: 'String', required: true },
      { name: 'totalQuestions', type: 'Number', required: true },
      { name: 'passingScore', type: 'Number', required: true },
      { name: 'timeLimit', type: 'Number' },
      { name: 'createdBy', type: 'ObjectId', required: true },
      { name: 'createdAt', type: 'Date', required: true },
      { name: 'updatedAt', type: 'Date', required: true },
      { name: 'isActive', type: 'Boolean', required: true, default: true },
      { name: 'questions', type: 'Array', required: true },
    ],
  },
  [COLLECTIONS.RESULTS]: {
    name: COLLECTIONS.RESULTS,
    description: 'Quiz results and scores',
    fields: [
      { name: '_id', type: 'ObjectId', required: true },
      { name: 'userId', type: 'ObjectId', required: true, ref: COLLECTIONS.USERS },
      { name: 'quizId', type: 'ObjectId', required: true, ref: COLLECTIONS.QUIZZES },
      { name: 'score', type: 'Number', required: true },
      { name: 'totalPoints', type: 'Number', required: true },
      { name: 'percentage', type: 'Number', required: true },
      { name: 'passed', type: 'Boolean', required: true },
      { name: 'completedAt', type: 'Date', required: true },
      { name: 'timeSpent', type: 'Number', required: true },
      { name: 'answers', type: 'Array', required: true },
    ],
  },
  [COLLECTIONS.CHAT_MESSAGES]: {
    name: COLLECTIONS.CHAT_MESSAGES,
    description: 'Chat messages between users',
    fields: [
      { name: '_id', type: 'ObjectId', required: true },
      { name: 'conversationId', type: 'ObjectId', required: true, ref: COLLECTIONS.CONVERSATIONS },
      { name: 'senderId', type: 'ObjectId', required: true, ref: COLLECTIONS.USERS },
      { name: 'message', type: 'String', required: true },
      { name: 'messageType', type: 'String', enum: ['text', 'code', 'image', 'file'], required: true },
      { name: 'attachments', type: 'Array' },
      { name: 'createdAt', type: 'Date', required: true },
      { name: 'updatedAt', type: 'Date', required: true },
      { name: 'isDeleted', type: 'Boolean', required: true, default: false },
    ],
  },
  [COLLECTIONS.CONVERSATIONS]: {
    name: COLLECTIONS.CONVERSATIONS,
    description: 'Conversations between multiple users',
    fields: [
      { name: '_id', type: 'ObjectId', required: true },
      { name: 'participants', type: 'Array', required: true },
      { name: 'title', type: 'String', required: true },
      { name: 'lastMessage', type: 'String' },
      { name: 'lastMessageTime', type: 'Date' },
      { name: 'createdAt', type: 'Date', required: true },
      { name: 'updatedAt', type: 'Date', required: true },
      { name: 'isActive', type: 'Boolean', required: true, default: true },
    ],
  },
  [COLLECTIONS.AUDIT_LOGS]: {
    name: COLLECTIONS.AUDIT_LOGS,
    description: 'Admin activity audit logs',
    fields: [
      { name: '_id', type: 'ObjectId', required: true },
      { name: 'adminId', type: 'ObjectId', required: true, ref: COLLECTIONS.ADMINS },
      { name: 'action', type: 'String', required: true },
      { name: 'description', type: 'String', required: true },
      { name: 'actionType', type: 'String', enum: ['create', 'update', 'delete', 'login', 'export'], required: true },
      { name: 'targetCollection', type: 'String', required: true },
      { name: 'targetId', type: 'ObjectId' },
      { name: 'changes', type: 'Object' },
      { name: 'ipAddress', type: 'String' },
      { name: 'userAgent', type: 'String' },
      { name: 'createdAt', type: 'Date', required: true },
    ],
  },
};

// Helper function to get collection schema
export function getCollectionSchema(collectionName: string) {
  return collectionSchemas[collectionName as keyof typeof collectionSchemas];
}

// Export all collection names for easy access
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
