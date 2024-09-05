import { pgTable, serial, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
});
export const db = drizzle(pool);

// Users Table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

// Categories Table
export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

// Transactions Table
export const transactionsTable = pgTable('transactions', {
  id: serial('id').primaryKey(),
  user_id: numeric('user_id').references(() => usersTable.id).notNull(), // Use `user_id` instead of `userId`
  category_id: numeric('category_id').references(() => categoriesTable.id).notNull(), // Use `category_id` instead of `categoryId`
  title: text('title').notNull(),
  amount: numeric('amount').notNull(),
  type: text('type').notNull(), // 'income' or 'expense'
  date: timestamp('date').defaultNow(),
});
