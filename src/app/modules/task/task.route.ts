import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TaskValidation } from './task.validation';
import auth from '../../middlewares/auth.middleware';
import { TaskController } from './task.controller';
import { upload } from '../../middlewares/multer.middleware';

const router = express.Router();

router.post(
  '/create-task',
  // validateRequest(TaskValidation.createTaskZodSchema),
  auth(),
  upload.single('attachment'),
  TaskController.createTask
);

router.get('/my-tasks', auth(), TaskController.getAllUserTasks);

router.get(
  '/get-task-by-category',
  auth(),
  TaskController.getAllTasksByCategory
);

router.get('/:id', auth(), TaskController.getSingleTask);

router.patch(
  '/:id',
  // validateRequest(TaskValidation.updateTaskZodSchema),
  auth(),
  upload.single('attachment'),
  TaskController.updateTask
);

router.delete('/:id', auth(), TaskController.deleteTask);

export const TaskRoutes = router;
