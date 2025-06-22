import mongoose from 'mongoose';
import { Notification } from '../app/modules/notification/notification.model';

export const notifyUsers = async ({
  userIds,
  message,
  type,
  taskId,
  senderId,
}: {
  userIds: string[];
  message: string;
  type: string;
  taskId: string;
  senderId: string;
}) => {
  const uniqueIds = [...new Set(userIds)];

  await Promise.all(
    uniqueIds.map(async userId => {
      const storeData = {
        receiver: userId,
        message,
        notificationType: type,
        task: new mongoose.Types.ObjectId(taskId),
        sender: new mongoose.Types.ObjectId(senderId),
      };
      const notification = await Notification.create(storeData);
      globalThis.io.to(userId).emit(type, notification);
    })
  );
};
