import { ITaskComment } from './task-comment.interface';
import { TaskComment } from './task-comment.model';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const createTaskComment = async (
  payload: ITaskComment & { isReplay?: boolean; commentId?: string }
): Promise<ITaskComment> => {
  const { author, comment, task, isReplay, commentId } = payload;

  if (!task || !author || !comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'All fields are required');
  }

  // Convert commentId to ObjectId if it's a reply
  if (isReplay && commentId) {
    payload.parentComment = new mongoose.Types.ObjectId(commentId);
  }

  const newComment = await TaskComment.create(payload);
  if (!newComment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating a comment');
  }

  // Push to parent comment's replies array
  if (isReplay && commentId) {
    await TaskComment.findByIdAndUpdate(
      commentId,
      { $push: { replies: newComment._id } },
      { new: true }
    );
  }

  return newComment;
};

const getAllTaskComments = async (taskId: string): Promise<ITaskComment[]> => {
  const query = {
    parentComment: null,
    $or: [{ task: new mongoose.Types.ObjectId(taskId) }],
  };
  const comments = await TaskComment.find(query)
    .sort({ createdAt: 1 })
    .populate('author', '-password')
    .populate({ path: 'replies', options: { sort: { createdAt: 1 } } })
    .lean();
  return comments;
};

const getSingleTaskComment = async (
  id: string
): Promise<ITaskComment | null> => {
  const result = await TaskComment.findById(id)
    .populate('author', '-password')
    .populate('replies');
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, 'Task comment not found');
  return result;
};

const updateTaskComment = async (
  id: string,
  payload: Partial<ITaskComment>,
  userId: string
): Promise<ITaskComment | null> => {
  const existingComment = await TaskComment.findById(id);

  if (!existingComment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task comment not found');
  }

  if (existingComment.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to edit this comment'
    );
  }

  const updatedComment = await TaskComment.findByIdAndUpdate(
    id,
    {
      ...payload,
      isEdited: true,
      lastEditedAt: new Date().toISOString(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedComment;
};

const deleteTaskComment = async (
  id: string,
  userId: string
): Promise<ITaskComment | null> => {
  const findTaskComment = await TaskComment.findById(id);
  if (!findTaskComment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task comment not found');
  }

  if (findTaskComment.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this comment'
    );
  }

  // Delete all replies and the comment itself in parallel
  await Promise.all([
    TaskComment.deleteMany({ _id: { $in: findTaskComment.replies } }),
    TaskComment.deleteOne({ _id: id }),
  ]);

  return findTaskComment;
};

export const TaskCommentService = {
  createTaskComment,
  getAllTaskComments,
  getSingleTaskComment,
  updateTaskComment,
  deleteTaskComment,
};
