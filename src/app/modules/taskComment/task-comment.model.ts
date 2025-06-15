import { Schema, model } from 'mongoose';
import { ITaskComment } from './task-comment.interface';

const taskCommentSchema = new Schema<ITaskComment>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
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

export const TaskComment = model<ITaskComment>(
  'TaskComment',
  taskCommentSchema
);
