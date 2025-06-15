import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TaskCommentValidation } from './task-comment.validation';
import { TaskCommentController } from './task-comment.controller';
import auth from '../../middlewares/auth.middleware';

const router = express.Router();

router.post(
  '/create-task-comment',
  validateRequest(TaskCommentValidation.createTaskComment),
  auth(),
  TaskCommentController.createTaskComment
);

router.get(
  '/all-task-comments/:id',
  auth(),
  TaskCommentController.getAllTaskComments
);

router.get('/:id', auth(), TaskCommentController.getSingleTaskComment);

router.patch(
  '/:id',
  validateRequest(TaskCommentValidation.updateTaskComment),
  auth(),
  TaskCommentController.updateTaskComment
);

router.delete('/:id', auth(), TaskCommentController.deleteTaskComment);

export const TaskCommentRoutes = router;
