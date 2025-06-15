import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { GroupService } from './group.service';
import { IGroup } from './group.interface';
import sendResponse from '../../../utils/ApiResponse';
import httpStatus from 'http-status';
import pick from '../../../utils/pick';
import { IGenericResponse, IPaginationOptions } from '../../../types';
import { paginationFields } from '../../../utils/paginationConstant';
import { GroupConstant } from './group.constant';

const createGroup = catchAsync(async (req: Request, res: Response) => {
  const user = (req as Request & { user: { userId: string; role: string } })
    .user;
  const file = req.file;
  const image = file ? `/uploads/${file.filename}` : undefined;
  const result = await GroupService.createGroup({
    ...req.body,
    creator: user.userId,
    image,
  });
  sendResponse<IGroup>(res, {
    success: true,
    message: 'Group created successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getAllGroups = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, GroupConstant.groupFiltersFields);
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields
  );
  const result = await GroupService.getAllGroups(filters, paginationOptions);
  sendResponse<IGenericResponse<IGroup[]>>(res, {
    success: true,
    message: 'Groups retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getAllMyGroups = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, GroupConstant.groupFiltersFields);
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields
  );
  const result = await GroupService.getAllMyGroups(filters, paginationOptions);
  sendResponse<IGenericResponse<IGroup[]>>(res, {
    success: true,
    message: 'Groups retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getSingleGroup = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GroupService.getSingleGroup(id);
  sendResponse<IGroup>(res, {
    success: true,
    message: 'Group retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const updateGroup = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file;
  const image = file ? `/uploads/${file.filename}` : undefined;
  const result = await GroupService.updateGroup(id, {
    ...req.body,
    image,
  });
  sendResponse<IGroup>(res, {
    success: true,
    message: 'Group updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const deleteGroup = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GroupService.deleteGroup(id);
  sendResponse<IGroup>(res, {
    success: true,
    message: 'Group deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const GroupController = {
  createGroup,
  getAllGroups,
  getAllMyGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
};
