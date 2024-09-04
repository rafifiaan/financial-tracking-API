import { Type, Static } from '@sinclair/typebox';
import { Context } from 'hono';

// Simple email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Define the validator function
export const validateRequestBody = (schema: any) => {
  return async (c: Context, next: any) => {
    try {
      const body = await c.req.json();

      // Manual validation for email format
      if (schema.properties?.email && !emailRegex.test(body.email)) {
        return c.json({ error: 'Invalid email format' }, 400);
      }

      // Basic validation for required fields
      const requiredFields = schema.required || [];
      for (const field of requiredFields) {
        if (body[field] === undefined) {
          return c.json({ error: `${field} is required` }, 400);
        }
      }

      await next();
    } catch (error) {
      return c.json({ error: 'Invalid request body' }, 400);
    }
  };
};
