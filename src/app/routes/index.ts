import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { TaskRoutes } from '../modules/task/task.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { TaskCommentRoutes } from '../modules/taskComment/task-comment.route';
import { GroupRoutes } from '../modules/group/group.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/task',
    route: TaskRoutes,
  },
  {
    path: '/task-comment',
    route: TaskCommentRoutes,
  },
  {
    path: '/group',
    route: GroupRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export const routes = router;
