import { z } from 'zod';
import { ENUM_TASK_PRIORITY, ENUM_TASK_STATUS } from '../../../types/enum';

const createTaskZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    status: z
      .enum(Object.values(ENUM_TASK_STATUS) as [string, ...string[]])
      .default(ENUM_TASK_STATUS.TODO),
    dueDate: z.string({
      required_error: 'Due date is required',
    }),
    assignedTo: z
      .string({
        required_error: 'Assigned to is required',
      })
      .optional(),
    priority: z
      .enum(Object.values(ENUM_TASK_PRIORITY) as [string, ...string[]])
      .default(ENUM_TASK_PRIORITY.LOW),
    category: z.string(),
    attachment: z.string().optional(),
  }),
});

const updateTaskZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z
      .enum(Object.values(ENUM_TASK_STATUS) as [string, ...string[]])
      .optional(),
    dueDate: z.string().optional(),
    assignedTo: z.string().optional(),
    priority: z
      .enum(Object.values(ENUM_TASK_PRIORITY) as [string, ...string[]])
      .optional(),
    category: z.string().optional(),
    attachment: z.string().optional(),
  }),
});

export const TaskValidation = {
  createTaskZodSchema,
  updateTaskZodSchema,
};
