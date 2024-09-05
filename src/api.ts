import { Hono } from 'hono';
import { getUsers, addUser, addTransaction, getTransactions, getBalance } from './services';
import { validateRequestBody } from '../utils/validator';
import { UserSchema, TransactionSchema } from './validation';

const app = new Hono();

// Get all users
app.get('/users', async (c) => {
  const users = await getUsers();
  return c.json(users);
});

// Add a new user
app.post('/users', validateRequestBody(UserSchema), async (c) => {
  const body = await c.req.json();
  console.log('Request body (users):', body); 
  const user = await addUser(body);
  return c.json(user, 201);
});

// Add a transaction
app.post('/transactions', validateRequestBody(TransactionSchema), async (c) => {
  try {
    const body = await c.req.json();
    console.log('Request body (transactions):', body); 
    if (isNaN(body.user_id) || isNaN(body.category_id)) {
      return c.json({ error: "Invalid userId or categoryId" }, 400);
    }
    const transaction = await addTransaction(body);
    return c.json(transaction, 201);
  } catch (error) {
    console.error('Error handling transaction request:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all transactions for a user
app.get('/transactions', async (c) => {
  try {
    const userId = Number(c.req.query('user_id'));
    
    if (isNaN(userId)) {
      return c.json({ error: 'Invalid user ID' }, 400);
    }

    const transactions = await getTransactions(userId);
    return c.json(transactions, 200);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    return c.json({ error: 'Failed to retrieve transactions' }, 500);
  }
});

// Get balance summary for a user
app.get('/balance', async (c) => {
  const userId = Number(c.req.query('user_id'));

  // Log untuk debugging nilai user_id
  console.log('Received user_id:', c.req.query('user_id'));

  if (isNaN(userId)) {
    return c.json({ error: 'Invalid user_id' }, 400);
  }

  try {
    const balance = await getBalance(userId);
    return c.json(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
