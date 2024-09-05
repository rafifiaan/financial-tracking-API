import { Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { Database } from './db-structure';

config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
});

export const dbKysely = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool,
  }),
});
