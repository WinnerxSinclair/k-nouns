import { z } from 'zod'

const pwExpr = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const loginSchema = z.strictObject({
  email: z.email(),
  password: z.string().regex(pwExpr)
});

export const signupSchema = z.strictObject({
  email: z.email(),
  password: z.string().regex(pwExpr, 'Invalid Format'),
  confirmPassword: z.string().regex(pwExpr, 'Invalid Format')
});