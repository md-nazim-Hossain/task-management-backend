import { Request, Response } from 'express';
import { TaskCommentService } from './task-comment.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ITaskComment } from './task-comment.interface';
import sendResponse from '../../../utils/ApiResponse';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const createTaskComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as Request & { user: { userId: string; role: string } })
    .user;
  const result = await TaskCommentService.createTaskComment({
    ...req.body,
    author: new mongoose.Types.ObjectId(user.userId),
  });
  sendResponse<ITaskComment>(res, {
    success: true,
    message: 'Task comment created successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getAllTaskComments = catchAsync(async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const result = await TaskCommentService.getAllTaskComments(taskId);
  sendResponse<ITaskComment[]>(res, {
    success: true,
    message: 'Task comments retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getSingleTaskComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskCommentService.getSingleTaskComment(id);
  sendResponse<ITaskComment>(res, {
    success: true,
    message: 'Task comment retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const updateTaskComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskCommentService.updateTaskComment(id, req.body);
  sendResponse<ITaskComment>(res, {
    success: true,
    message: 'Task comment updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const deleteTaskComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskCommentService.deleteTaskComment(id);
  sendResponse<ITaskComment>(res, {
    success: true,
    message: 'Task comment deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const TaskCommentController = {
  createTaskComment,
  getAllTaskComments,
  getSingleTaskComment,
  updateTaskComment,
  deleteTaskComment,
};
