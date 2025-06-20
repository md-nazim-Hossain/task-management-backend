import { Request, Response } from 'express';
import sendResponse from '../../../utils/ApiResponse';
import { catchAsync } from '../../../utils/catchAsync';
import { ITask } from './task.interface';
import { TaskService } from './task.service';
import httpStatus from 'http-status';
import pick from '../../../utils/pick';
import { TaskConstant } from './task.constant';
import { IPaginationOptions } from '../../../types';
import { paginationFields } from '../../../utils/paginationConstant';

const createTask = catchAsync(async (req: Request, res: Response) => {
  const user = (req as Request & { user: { userId: string; role: string } })
    .user;
  const file = req.file;
  const attachment = file
    ? {
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
      }
    : undefined;

  const taskPayload = {
    ...req.body,
    attachment,
    creator: user.userId,
  };
  const result = await TaskService.createTask(taskPayload);
  sendResponse<ITask>(res, {
    success: true,
    message: 'Task created successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, TaskConstant.taskFiltersFields);
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields
  );
  const result = await TaskService.getAllTasks(filters, paginationOptions);
  sendResponse<ITask[]>(res, {
    success: true,
    message: 'Tasks retrieved successfully',
    data: result.data,
    meta: result.meta,
    statusCode: httpStatus.OK,
  });
});

const getAllUserTasks = catchAsync(async (req: Request, res: Response) => {
  const user = (req as Request & { user: { userId: string; role: string } })
    .user;

  const filters = pick(req.query, TaskConstant.taskFiltersFields);
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields
  );
  const result = await TaskService.getAllUserTasks(
    user.userId,
    filters,
    paginationOptions
  );
  sendResponse<ITask[]>(res, {
    success: true,
    message: 'Tasks retrieved successfully',
    data: result.data,
    meta: result.meta,
    statusCode: httpStatus.OK,
  });
});

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskService.getSingleTask(id);
  sendResponse<ITask>(res, {
    success: true,
    message: 'Task retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file;
  const attachment = file
    ? {
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
      }
    : undefined;

  const taskPayload = {
    ...req.body,
    attachment,
  };
  const result = await TaskService.updateTask(id, taskPayload);
  sendResponse<ITask>(res, {
    success: true,
    message: 'Task updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskService.deleteTask(id);
  sendResponse<ITask>(res, {
    success: true,
    message: 'Task deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const TaskController = {
  createTask,
  getAllUserTasks,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};
