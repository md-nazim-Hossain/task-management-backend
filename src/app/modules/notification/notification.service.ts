import { Notification } from './notification.model';

const getAllMyNotifications = async (id: string) => {
  const result = await Notification.find({ receiver: id }).sort({
    createdAt: -1,
  });
  const unreadCount = await Notification.countDocuments({
    receiver: id,
    isRead: false,
  });
  return {
    data: result,
    unreadCount,
  };
};

const deleteNotification = async (id: string) => {
  const result = await Notification.findOneAndDelete({ _id: id });
  return result;
};

const readNotification = async (id: string) => {
  const result = await Notification.findOneAndUpdate(
    { _id: id },
    { isRead: true },
    { new: true }
  );
  return result;
};
export const NotificationService = {
  getAllMyNotifications,
  deleteNotification,
  readNotification,
};
