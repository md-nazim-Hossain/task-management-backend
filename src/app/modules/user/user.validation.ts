import { z } from "zod";
import { ENUM_USER_ROLE } from "../../../types/enum";

// req-validation
const createUserZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    email: z.string().email(),
    fullName: z.string(),
    role: z
      .enum(Object.values(ENUM_USER_ROLE) as [string, ...string[]])
      .optional()
      .default(ENUM_USER_ROLE.USER),
    status: z.boolean().optional().default(true),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
