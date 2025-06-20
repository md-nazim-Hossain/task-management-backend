import { Types } from 'mongoose';

export type INotification = {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  task: Types.ObjectId;
};
