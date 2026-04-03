// MongoDB Client Configuration
// This client connects to the MongoDB Atlas instance for Corvit Educator

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI;
const MONGODB_DB_NAME = import.meta.env.VITE_MONGODB_DB_NAME || 'Corvit Educator';

// MongoDB Connection class for client-side usage
// Note: For production, consider using a backend API instead of direct client connections

export class MongoDBClient {
  private uri: string;
  private dbName: string;

  constructor(uri: string = MONGODB_URI, dbName: string = MONGODB_DB_NAME) {
    this.uri = uri;
    this.dbName = dbName;
  }

  getUri(): string {
    return this.uri;
  }

  getDbName(): string {
    return this.dbName;
  }

  // Helper method to construct collection names
  getCollectionName(collection: string): string {
    return collection;
  }
}

export const mongoClient = new MongoDBClient();

// Export configuration for API calls
export const mongodbConfig = {
  uri: MONGODB_URI,
  dbName: MONGODB_DB_NAME,
};
