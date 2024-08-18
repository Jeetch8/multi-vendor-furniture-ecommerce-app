import * as schema from '@/lib/schema/index';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client, schema });
