import { Request, Response } from 'express';

import httpStatus from 'http-status';
import { IUser } from './user.interface';
import { catchAsync } from '../../../utils/catchAsync';
import { UserService } from './user.service';
import sendResponse from '../../../utils/ApiResponse';

const createdUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);
  sendResponse<IUser>(res, {
    success: true,
    message: 'User created successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as Request & { user: { userId: string; role: string } })
    .user;
  const result = await UserService.getSingleUser(user.userId);
  sendResponse<IUser>(res, {
    success: true,
    message: 'User retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

// eslint-disable-next-line no-unused-vars
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse<IUser[]>(res, {
    success: true,
    message: 'Users retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUser(id);
  sendResponse<IUser>(res, {
    success: true,
    message: 'User retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateUser(id, req.body);
  sendResponse<IUser>(res, {
    success: true,
    message: 'User updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUser(id);
  sendResponse<IUser>(res, {
    success: true,
    message: 'User deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const UserController = {
  createdUser,
  getMyProfile,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
