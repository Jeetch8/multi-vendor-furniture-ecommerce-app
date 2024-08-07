import * as schema from '@/lib/schema/index';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const client = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: false,
});
export const db = drizzle({ client, schema });
