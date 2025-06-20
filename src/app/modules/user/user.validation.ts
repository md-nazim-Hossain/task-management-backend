import { z } from 'zod';
import { ENUM_USER_ROLE } from '../../../types/enum';

const createUserZodSchema = z.object({
  body: z.object({
    password: z.string().min(6),
    email: z.string().email(),
    fullName: z.string(),
    role: z
      .enum(Object.values(ENUM_USER_ROLE) as [string, ...string[]])
      .default(ENUM_USER_ROLE.USER),
    status: z.boolean().optional().default(true),
    profileImage: z.any().optional(),
  }),
});

const updateUserZodSchema = z.object({
  fullName: z.string().optional(),
  role: z
    .enum(Object.values(ENUM_USER_ROLE) as [string, ...string[]])
    .optional()
    .default(ENUM_USER_ROLE.USER),
  status: z.boolean().optional(),
  profileImage: z.any().optional(),
});
export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
