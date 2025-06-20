import { z } from 'zod';

const createGroupZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string().optional(),
    image: z.any().optional(),
    members: z.array(z.string()).optional(),
    status: z.boolean().default(true),
  }),
});

const updateGroupZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.any().optional(),
    members: z.array(z.string()).optional(),
    status: z.boolean().optional(),
  }),
});

export const GroupValidation = {
  createGroupZodSchema,
  updateGroupZodSchema,
};
