# MongoDB Integration for Corvit Educator

This directory contains MongoDB configuration and schema definitions for the Corvit Educator platform.

## Configuration

The MongoDB connection is configured via environment variables in `.env`:

```env
VITE_MONGODB_URI=mongodb+srv://nehma:Pak2122@1st.tagscjg.mongodb.net/Corvit%20Educator?retryWrites=true&w=majority
VITE_MONGODB_DB_NAME=Corvit Educator
```

## Database Structure

The **Corvit Educator** database contains the following collections:

### 1. **admins** - Administrator Users
Stores admin and moderator accounts with role-based permissions.

**Fields:**
- `_id`: ObjectId (auto-generated)
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, should be hashed)
- `role`: String - `super_admin` | `admin` | `moderator` (required)
- `permissions`: Array (required)
- `createdAt`: Date (required)
- `updatedAt`: Date (required)
- `lastLogin`: Date (optional)
- `isActive`: Boolean (default: true)
- `phone`: String (optional)
- `department`: String (optional)

**Indexes:**
- Unique index on `email`
- Index on `createdAt` (descending)
- Index on `isActive`

### 2. **users** - Students, Instructors, Parents
Stores user accounts for students, instructors, and parents.

**Fields:**
- `_id`: ObjectId
- `firstName`: String (required)
- `lastName`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String - `student` | `instructor` | `parent` (required)
- `createdAt`: Date (required)
- `updatedAt`: Date (required)
- `lastLogin`: Date (optional)
- `isActive`: Boolean (default: true)
- `profileImage`: String (optional, URL)
- `phone`: String (optional)

**Indexes:**
- Unique index on `email`
- Index on `createdAt` (descending)
- Index on `role`

### 3. **courses** - Educational Courses
Stores course information.

**Fields:**
- `_id`: ObjectId
- `title`: String (required)
- `description`: String (required)
- `instructor`: ObjectId (required, reference to users)
- `category`: String (required)
- `level`: String - `beginner` | `intermediate` | `advanced` (required)
- `students`: Array of ObjectId (references to users)
- `createdAt`: Date (required)
- `updatedAt`: Date (required)
- `isActive`: Boolean (default: true)
- `thumbnail`: String (optional, URL)

**Indexes:**
- Index on `instructor`
- Index on `category`
- Index on `createdAt` (descending)

### 4. **quizzes** - Quiz Configurations
Stores quiz configurations with questions.

**Fields:**
- `_id`: ObjectId
- `courseId`: ObjectId (required, reference to courses)
- `title`: String (required)
- `description`: String (required)
- `totalQuestions`: Number (required)
- `passingScore`: Number (required)
- `timeLimit`: Number (optional, in minutes)
- `createdBy`: ObjectId (required, reference to admins or users)
- `questions`: Array (required)
- `createdAt`: Date (required)
- `updatedAt`: Date (required)
- `isActive`: Boolean (default: true)

### 5. **results** - Quiz Results
Stores user quiz results and scores.

**Fields:**
- `_id`: ObjectId
- `userId`: ObjectId (required, reference to users)
- `quizId`: ObjectId (required, reference to quizzes)
- `score`: Number (required)
- `totalPoints`: Number (required)
- `percentage`: Number (required)
- `passed`: Boolean (required)
- `completedAt`: Date (required)
- `timeSpent`: Number (required, in seconds)
- `answers`: Array (required)

**Indexes:**
- Unique index on `userId` and `quizId`
- Index on `completedAt` (descending)

### 6. **chatMessages** - Chat Messages
Stores chat messages between users.

**Fields:**
- `_id`: ObjectId
- `conversationId`: ObjectId (required, reference to conversations)
- `senderId`: ObjectId (required, reference to users)
- `message`: String (required)
- `messageType`: String - `text` | `code` | `image` | `file` (required)
- `attachments`: Array (optional, URLs)
- `createdAt`: Date (required)
- `updatedAt`: Date (required)
- `isDeleted`: Boolean (default: false)

### 7. **conversations** - Conversations
Stores conversation metadata between multiple users.

**Fields:**
- `_id`: ObjectId
- `participants`: Array of ObjectId (required)
- `title`: String (required)
- `lastMessage`: String (optional)
- `lastMessageTime`: Date (optional)
- `createdAt`: Date (required)
- `updatedAt`: Date (required)
- `isActive`: Boolean (default: true)

### 8. **auditLogs** - Audit Logs
Stores admin activity logs for security and compliance.

**Fields:**
- `_id`: ObjectId
- `adminId`: ObjectId (required, reference to admins)
- `action`: String (required)
- `description`: String (required)
- `actionType`: String - `create` | `update` | `delete` | `login` | `export` (required)
- `targetCollection`: String (required)
- `targetId`: ObjectId (optional)
- `changes`: Object (optional)
- `ipAddress`: String (optional)
- `userAgent`: String (optional)
- `createdAt`: Date (required)

## File Structure

- `client.ts` - MongoDB client configuration and initialization
- `types.ts` - TypeScript type definitions for all collections
- `collections.ts` - Collection names and schema definitions
- `README.md` - This documentation file

## Usage

### Accessing the Configuration

```typescript
import { mongodbConfig, mongoClient } from '@/integrations/mongodb/client';
import { COLLECTIONS } from '@/integrations/mongodb/collections';
import type { Admin, User, Course } from '@/integrations/mongodb/types';

// Get MongoDB URI and database name
const { uri, dbName } = mongodbConfig;

// Use collection names
const adminCollection = COLLECTIONS.ADMINS;
```

### API Integration

For client-side applications, it's recommended to use a backend API instead of direct MongoDB connections. Create API endpoints that handle database operations securely.

Example backend structure:
```
/api
  /admin
    - POST /login
    - GET /profile
    - PUT /profile
  /user
    - POST /register
    - GET /courses
    - POST /quiz/:quizId/submit
  /quiz
    - GET /:id
    - GET /:id/questions
```

## Security Considerations

1. **Password Hashing**: Always hash passwords before storing (use bcrypt or similar)
2. **Connection String**: Keep credentials in environment variables, never commit to repository
3. **Client-Side Operations**: Avoid direct database operations from client; use secure APIs
4. **Role-Based Access**: Implement role-based access control for all operations
5. **Audit Logging**: Log all admin actions for compliance

## Next Steps

1. Set up backend API endpoints for CRUD operations
2. Implement authentication and authorization
3. Create database migration scripts if needed
4. Set up MongoDB Atlas alerts and monitoring
5. Implement data validation and sanitization
