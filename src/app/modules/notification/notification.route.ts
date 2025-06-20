import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth.middleware';

const router = express.Router();

router.get(
  '/my-notifications',
  auth(),
  NotificationController.getAllMyNotifications
);
router.delete(
  '/delete-notification/:id',
  auth(),
  NotificationController.deleteNotification
);
router.post(
  '/read-notification/:id',
  auth(),
  NotificationController.readNotification
);
export const NotificationRoutes = router;
