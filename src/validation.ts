import { Static, Type } from '@sinclair/typebox';

// User Schema
export const UserSchema = Type.Object({
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
}, { additionalProperties: false });

// Transaction Schema
export const TransactionSchema = Type.Object({
  title: Type.String(),
  amount: Type.Number(),
  type: Type.String(),
  category_id: Type.Integer(),
  user_id: Type.Integer()
});

export type TransactionType = Static<typeof TransactionSchema>;
