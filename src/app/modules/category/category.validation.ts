import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    title: z.string(),
    status: z.boolean().optional().default(true),
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    status: z.boolean().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
