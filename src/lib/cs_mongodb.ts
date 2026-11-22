import dns from "node:dns";
import { MongoClient } from "mongodb";

const cs_uri = process.env.CS_MONGODB_URI;
if (!cs_uri) {
  throw new Error("CS_MONGODB_URI is not set in .env.local");
}

// Local Windows DNS fix for mongodb+srv (not needed on Vercel)
if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  dns.promises.setServers(["8.8.8.8", "8.8.4.4"]);
}

// Reuse one client across hot reloads / serverless calls
const cs_globalCache = globalThis as typeof globalThis & { cs_mongoClient?: MongoClient };

export const cs_mongoClient = cs_globalCache.cs_mongoClient ?? new MongoClient(cs_uri);
cs_globalCache.cs_mongoClient = cs_mongoClient;

export const cs_db = cs_mongoClient.db(process.env.CS_DB_NAME || "fixmate");
