
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const DB_NAME =
  process.env.MONGODB_DB || "trial_your_dream";

const client = new MongoClient(MONGO_URI);

let database: Db | null = null;
let connectionPromise: Promise<Db> | null = null;

export const connectDB = async (): Promise<Db> => {
  if (database) {
    return database;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    await client.connect();

    const db = client.db(DB_NAME);

    await db.command({ ping: 1 });

    database = db;

    console.log("MongoDB connected successfully!");
    console.log(`Database: ${DB_NAME}`);

    return db;
  })();

  try {
    return await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export const getDB = (): Db => {
  if (!database) {
    throw new Error("MongoDB is not connected. Call connectDB() first.");
  }

  return database;
};

export const closeDB = async (): Promise<void> => {
  await client.close();
  database = null;
  connectionPromise = null;
};
