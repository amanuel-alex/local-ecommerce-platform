import { z } from 'zod'

// =========================
// LOGIN SCHEMA
// =========================
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})


// =========================
// REGISTER SCHEMA
// =========================
export const registerSchema = z.object({
  full_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),

  email: z.string().email('Please enter a valid email address'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  confirm_password: z.string(),

  // ❗ FIXED: removed `.default()` because default is already set in RHF
  account_type: z.enum(['customer', 'seller']),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})


// =========================
// FORGOT PASSWORD SCHEMA
// =========================
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})


// =========================
// RESET PASSWORD SCHEMA
// =========================
export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})
