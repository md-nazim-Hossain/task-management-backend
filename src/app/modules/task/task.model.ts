import { model, Schema } from 'mongoose';
import { ENUM_TASK_PRIORITY, ENUM_TASK_STATUS } from '../../../types/enum';
import { ITask } from './task.interface';

const taskSchema = new Schema<ITask, Record<string, unknown>>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ENUM_TASK_STATUS),
      default: ENUM_TASK_STATUS.TODO,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    priority: {
      type: String,
      enum: Object.values(ENUM_TASK_PRIORITY),
      default: ENUM_TASK_PRIORITY.LOW,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    attachment: {
      fileName: { type: String, required: false },
      fileUrl: { type: String, required: false },
      mimeType: { type: String, required: false },
      size: { type: Number, required: false },
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

taskSchema.virtual('taskComments', {
  ref: 'TaskComment',
  localField: '_id',
  foreignField: 'task',
});

taskSchema.pre('find', function () {
  this.populate('creator', '+email +fullName +profileImage +_id');
  this.populate('category', '+title +_id +slug +description +status');
});

export const Task = model<ITask>('Task', taskSchema);
