import { z } from 'zod';
import type { AuthMode } from './auth-flow';

const passwordRule = z.string().min(8, 'Минимум 8 символов.');

export const authCredentialsBaseSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  password_confirmation: z.string().optional(),
  email: z.string().email('Введите корректный email.'),
  password: passwordRule,
});

export type AuthCredentialsFormValues = z.infer<typeof authCredentialsBaseSchema>;

export function getCredentialsSchema(mode: AuthMode) {
  return authCredentialsBaseSchema.superRefine((value, context) => {
    if (mode === 'login') {
      return;
    }

    if (!value.name || value.name.trim().length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: 'Укажите имя и фамилию.',
      });
    }

    if (!value.password_confirmation || value.password !== value.password_confirmation) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password_confirmation'],
        message: 'Пароли не совпадают.',
      });
    }
  });
}

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, 'Введите 6 цифр из письма.'),
});

export const recoveryRequestSchema = z.object({
  email: z.string().email('Введите корректный email.'),
});

export const recoveryResetSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, 'Введите 6 цифр из письма.'),
  password: passwordRule,
  password_confirmation: passwordRule,
}).refine((value) => value.password === value.password_confirmation, {
  message: 'Пароли не совпадают.',
  path: ['password_confirmation'],
});
