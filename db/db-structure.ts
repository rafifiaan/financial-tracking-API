// Define the interface for the 'users' table
interface UsersTable {
    id: number;
    username: string;
    email: string;
    password: string;
}
  
// Define the interface for the 'categories' table
interface CategoriesTable {
    id: number;
    name: string;
}

// Define the interface for the 'transactions' table
interface TransactionsTable {
    id: number;
    user_id: number;
    category_id: number;
    title: string;
    amount: number;
    type: string;  // 'income' or 'expense'
    date: Date;
}

// Define the overall database schema
export interface Database {
    users: UsersTable;
    categories: CategoriesTable;
    transactions: TransactionsTable;
}
