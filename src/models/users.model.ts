import mongoose, { Document } from 'mongoose';
import z from 'zod';
import validator from 'validator';

// Define the roles
const roles = ['Admin', 'Moderator', 'Editor', 'Viewer'];

// Zod schema for validation
const stringSchema = z
  .string({ invalid_type_error: 'Do not leave this field empty', required_error: 'Mandatory Field' })
  .trim()
  .max(255);

const emailSchema = stringSchema.refine(
  (str) => validator.isEmail(str),
  { message: 'Please enter a valid email address' }
);

const passwordSchema = z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .refine((val) => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
  .refine((val) => /[a-z]/.test(val), { message: 'Password must contain at least one lowercase letter' })
  .refine((val) => /[0-9]/.test(val), { message: 'Password must contain at least one number' })
  .refine((val) => /[!@#$%^&*()]/.test(val),{ message: 'Password must contain at least one special sign'});

export const SignUpSchema = z.object({
  name: stringSchema.min(1, { message: 'Mandatory Field' }),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Mongoose schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 255 },
  email: { type: String, required: true, trim: true, unique: true, maxlength: 255 },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: roles,
    default: 'Viewer'
  },
});

// TypeScript type for User Document
export type UserDocument = Document & {
  name: string;
  email: string;
  password: string;
  role: string;
};

const User = mongoose.model('User', userSchema);
export default User;
export type SignUp = z.infer<typeof SignUpSchema>;
export type SignUpDocument = SignUp & Document;
