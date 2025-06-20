import sendResponse from '../../../utils/ApiResponse';
import { catchAsync } from '../../../utils/catchAsync';
import { INotification } from './notification.interface';
import { NotificationService } from './notification.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const getAllMyNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const user = (req as Request & { user: { userId: string; role: string } })
      .user;
    const result = await NotificationService.getAllMyNotifications(user.userId);
    sendResponse<{ data: INotification[]; unreadCount: number }>(res, {
      success: true,
      message: 'Notifications retrieved successfully',
      data: result,
      statusCode: httpStatus.OK,
    });
  }
);

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.deleteNotification(id);
  sendResponse<INotification>(res, {
    success: true,
    message: 'Notification deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const readNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.readNotification(id);
  sendResponse<INotification>(res, {
    success: true,
    message: 'Notification read successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const NotificationController = {
  getAllMyNotifications,
  deleteNotification,
  readNotification,
};
