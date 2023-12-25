import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI as string);
let dbInstance: Db | null = null;

export const initDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in your .env file');
    }
    await client.connect();
    dbInstance = client.db(process.env.DB_NAME); 
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
};

export const getDb = (): Db => {
  if (!dbInstance) {
    throw new Error('No database instance found! Did you forget to call initDb?');
  }
  return dbInstance;
};
