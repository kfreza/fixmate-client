import { MongoClient } from "mongodb";

const cs_uri = process.env.CS_MONGODB_URI;
if (!cs_uri) {
  throw new Error("CS_MONGODB_URI is not set in .env.local");
}

// Reuse one client across hot reloads / serverless calls
const cs_globalCache = globalThis as typeof globalThis & { cs_mongoClient?: MongoClient };

export const cs_mongoClient = cs_globalCache.cs_mongoClient ?? new MongoClient(cs_uri);
cs_globalCache.cs_mongoClient = cs_mongoClient;

export const cs_db = cs_mongoClient.db(process.env.CS_DB_NAME || "fixmate");
