// MongoDB Integration Exports
// Central export file for all MongoDB-related utilities and types

export { MongoDBClient, mongoClient, mongodbConfig } from './client';
export { COLLECTIONS, collectionSchemas, getCollectionSchema, type CollectionName } from './collections';
export type {
  Admin,
  User,
  Course,
  Quiz,
  Question,
  Result,
  UserAnswer,
  ChatMessage,
  Conversation,
  AuditLog,
} from './types';
export { mongoDBIndexes } from './types';
