import { Type, Static } from '@sinclair/typebox';
import { Context } from 'hono';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Inisialisasi AJV dan tambahkan formats
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);  // Pastikan addFormats digunakan setelah AJV diinisialisasi

// Fungsi untuk mengkompilasi dan memvalidasi skema
const validate = (schema: any) => ajv.compile(schema);

// Define the validator function
export const validateRequestBody = (schema: any) => {
  const validateSchema = validate(schema);

  return async (c: Context, next: any) => {
    try {
      const body = await c.req.json();

      // Validasi schema menggunakan AJV
      const valid = validateSchema(body);

      if (!valid) {
        // Menyusun pesan kesalahan dari hasil validasi
        const errors = validateSchema.errors?.map(error => ({
          message: error.message,
          path: error.instancePath
        }));

        return c.json({ error: 'Invalid request body', details: errors }, 400);
      }

      await next();
    } catch (error) {
      return c.json({ error: 'Invalid request body' }, 400);
    }
  };
};
