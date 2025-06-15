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
      index: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
      fileName: String,
      fileUrl: String,
      mimeType: String,
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

export const Task = model<ITask>('Task', taskSchema);
