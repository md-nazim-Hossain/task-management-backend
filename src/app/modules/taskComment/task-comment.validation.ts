import { z } from 'zod';

const createTaskComment = z.object({
  body: z.object({
    task: z.string({
      required_error: 'Task id is required',
    }),
    comment: z.string({
      required_error: 'Comment is required',
    }),
  }),
});

const updateTaskComment = z.object({
  body: z.object({
    comment: z.string({
      required_error: 'Comment is required',
    }),
  }),
});

export const TaskCommentValidation = {
  createTaskComment,
  updateTaskComment,
};
