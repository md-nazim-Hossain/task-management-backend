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
    isEdited: {
      type: Boolean,
      default: false,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    lastEditedAt: {
      type: Date,
      default: null,
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

taskCommentSchema.pre('find', function (next) {
  this.populate({
    path: 'replies',
    options: { sort: { createdAt: -1 } },
    populate: {
      path: 'author',
      select: '-password',
    },
  });
  next();
});

export const TaskComment = model<ITaskComment>(
  'TaskComment',
  taskCommentSchema
);
