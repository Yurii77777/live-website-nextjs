import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const cleanConnectionString = connectionString.split('?')[0];

const client = postgres(cleanConnectionString, { prepare: false });

export const db = drizzle(client, { schema });
