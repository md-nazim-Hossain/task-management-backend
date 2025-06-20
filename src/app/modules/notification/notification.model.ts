import { model, Schema } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification, Record<string, unknown>>(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notificationType: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

notificationSchema.pre('find', function (next) {
  this.populate('sender', '+email +fullName +profileImage +_id');
  this.populate('receiver', '+email +fullName +profileImage +_id');
  this.populate('task');
  next();
});

export const Notification = model<INotification>(
  'Notification',
  notificationSchema
);
