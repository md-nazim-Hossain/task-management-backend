import { ITaskComment } from './task-comment.interface';
import { TaskComment } from './task-comment.model';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';

const createTaskComment = async (
  payload: ITaskComment
): Promise<ITaskComment> => {
  return await TaskComment.create(payload);
};

const getAllTaskComments = async (taskId: string): Promise<ITaskComment[]> => {
  return await TaskComment.find({
    task: taskId,
  });
};

const getSingleTaskComment = async (
  id: string
): Promise<ITaskComment | null> => {
  const result = await TaskComment.findById(id);
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, 'Task comment not found');
  return result;
};

const updateTaskComment = async (
  id: string,
  payload: Partial<ITaskComment>
): Promise<ITaskComment | null> => {
  const findTaskComment = await TaskComment.findById(id);
  if (!findTaskComment)
    throw new ApiError(httpStatus.NOT_FOUND, 'Task comment not found');
  const result = await TaskComment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteTaskComment = async (id: string): Promise<ITaskComment | null> => {
  const findTaskComment = await TaskComment.findById(id);
  if (!findTaskComment)
    throw new ApiError(httpStatus.NOT_FOUND, 'Task comment not found');
  const result = await TaskComment.findOneAndDelete({ _id: id });
  return result;
};

export const TaskCommentService = {
  createTaskComment,
  getAllTaskComments,
  getSingleTaskComment,
  updateTaskComment,
  deleteTaskComment,
};
