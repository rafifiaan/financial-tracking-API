import { db, usersTable, transactionsTable } from '../db/db-drizzle';
import { eq, and } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm/sql';
import { dbKysely } from '../db/db-kysely';
import { Database } from '../db/db-structure';

// Get all users
export async function getUsers() {
  try {
    const users = await db.select().from(usersTable);
    console.log('Users retrieved:', users); 
    return users;
  } catch (error) {
    console.error('Error getting users:', error); 
    throw error; 
  }
}

// Add a new user
export async function addUser(data: { username: string, email: string, password: string }) {
  try {
    console.log('Adding user with data:', data);

    const result = await db.insert(usersTable).values({
      username: data.username,
      email: data.email,
      password: data.password,
    }).returning();

    if (!result || result.length === 0) {
      throw new Error('User insertion failed');
    }

    console.log('User added successfully:', result);
    return result[0];
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// Add a transaction
export async function addTransaction(data: { title: string, amount: number, type: string, category_id: number, user_id: number }) {
  try {
    console.log('Adding transaction with data:', data); 
    const result = await db.insert(transactionsTable).values({
      title: data.title,
      amount: data.amount,
      type: data.type,
      category_id: data.category_id,
      user_id: data.user_id,
    }).returning();
    
    console.log('Transaction added successfully:', result);
    return result[0];
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

// Get transactions for a user
export async function getTransactions(userId: number) {
  console.log('Received userId:', userId);
  try {
    console.log('Type of userId:', typeof userId);

    const transactions = await dbKysely
      .selectFrom('transactions')
      .select(['title', 'amount', 'type', 'date'])
      .where('user_id', '=', userId)
      .orderBy('date', 'desc')
      .execute();

    if (!transactions || transactions.length === 0) {
      throw new Error('No transactions found for the user');
    }
    return transactions;
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
}

// Get balance for a user
export async function getBalance(userId: number) {
  try {
    console.log('Calculating balance for userId:', userId);

    // Fetch details of income for the given user_id
    const incomeDetails = await db
      .select({
        title: transactionsTable.title,
        amount: transactionsTable.amount
      })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.user_id, userId),
          eq(transactionsTable.type, 'income')
        )
      );

    console.log('Income details:', incomeDetails);

    // Fetch total income for the given user_id
    const incomeTotal = await db
      .select({ income: sql`SUM(${transactionsTable.amount})`.as('income') })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.user_id, userId),
          eq(transactionsTable.type, 'income')
        )
      );

    console.log('Income total:', incomeTotal);

    // Fetch details of expenses for the given user_id
    const expenseDetails = await db
      .select({
        title: transactionsTable.title,
        amount: transactionsTable.amount
      })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.user_id, userId),
          eq(transactionsTable.type, 'expense')
        )
      );

    console.log('Expense details:', expenseDetails);

    // Fetch total expense for the given user_id
    const expenseTotal = await db
      .select({ expense: sql`SUM(${transactionsTable.amount})`.as('expense') })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.user_id, userId),
          eq(transactionsTable.type, 'expense')
        )
      );

    console.log('Expense total:', expenseTotal);

    // Extract values or default to 0 if no results
    const income = parseFloat((incomeTotal[0]?.income as string) ?? '0');
    const expense = parseFloat((expenseTotal[0]?.expense as string) ?? '0');

    // Calculate balance (income - expense)
    const balance = (income - expense).toFixed(2);

    console.log('Balance calculated:', balance);

    return {
      userId,
      incomeDetails,
      totalIncome: income.toFixed(2),
      expenseDetails,
      totalExpense: expense.toFixed(2),
      balance
    };
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
}