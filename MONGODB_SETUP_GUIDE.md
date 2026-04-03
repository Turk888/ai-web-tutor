# MongoDB Database Setup - Quick Guide

## Your Database Info
- **Database Name**: Corvit Educator
- **Cluster Name**: 1st
- **Admin Email**: nehmatullahkh@gmail.com
- **Admin Name**: nehmat
- **Connection String**: `mongodb+srv://nehmat:Pak2122@1st.tagscjg.mongodb.net/Corvit%20Educator?retryWrites=true&w=majority`

## How to Run the Setup

### Step 1: Go to MongoDB Atlas
1. Open [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in with your account
3. Click on your **"1st"** cluster
4. Click **"Database"** in the left sidebar

### Step 2: Open Web Terminal
1. Click the **"..."** (three dots) menu next to your cluster
2. Select **"Browse Collections"** or find the **terminal icon**
3. A mongosh terminal will open in your browser

### Step 3: Copy & Paste the Setup Script
1. Open the file: `mongosh-setup.js` in this project
2. Copy ALL the code (Ctrl+A, Ctrl+C)
3. Paste it into the MongoDB Atlas web terminal (Ctrl+V)
4. Press Enter

### Step 4: Wait for Completion
The script will:
- ✅ Create 9 collections
- ✅ Create all indexes
- ✅ Create your super admin account
- ✅ Display confirmation message

## What Gets Created

### Collections (9 total):
1. **admins** - Admin users
2. **users** - Students, instructors, parents
3. **courses** - Educational courses
4. **quizzes** - Quiz configurations
5. **questions** - Quiz questions
6. **results** - Quiz results
7. **chatMessages** - Chat messages
8. **conversations** - Conversations/threads
9. **auditLogs** - Activity logs

### Admin Account Created:
- **Email**: nehmatullahkh@gmail.com
- **Name**: nehmat
- **Role**: super_admin
- **Permissions**: All (manage_users, manage_courses, manage_quizzes, etc.)

## Important Notes

⚠️ **Password Security**:
- The setup script includes a placeholder hashed password
- In production, before using this admin account, you MUST:
  1. Generate a proper bcrypt hash of "Pak2122"
  2. Update the password field in the database
  3. Or use a secure password reset flow

## After Setup

Once the script completes successfully:
1. ✅ Your database is ready
2. ✅ All collections are created
3. ✅ All indexes are set up
4. ✅ Your admin account is ready
5. ✅ Your application can use it

## Troubleshooting

**Error: "Database already exists"**
- This is fine! The collections will be created in your existing database

**Error: "email index already exists"**
- This is fine! It means you've run the script before

**If you need to delete and start over**:
```javascript
use "Corvit Educator"
db.dropDatabase()
// Then run the setup script again
```

## Next Steps

Your Corvit Educator application is now configured with:
- ✅ MongoDB connection string in `.env`
- ✅ TypeScript type definitions
- ✅ Database schema with collections and indexes
- ✅ Super admin account ready to use

Now you can start building your admin panel and api endpoints! 🚀
