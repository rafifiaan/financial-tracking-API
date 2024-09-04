import app from './src/api';
import { config } from 'dotenv';

config();

const server = Bun.serve({
  fetch: app.fetch,
  port: 5000,
});

console.log('Yeay! Server is running at http://localhost:5000');
