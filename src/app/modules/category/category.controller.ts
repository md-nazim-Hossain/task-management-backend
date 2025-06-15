import { Request, Response } from 'express';
import sendResponse from '../../../utils/ApiResponse';
import { catchAsync } from '../../../utils/catchAsync';
import { ICategory } from './category.interface';
import { CategoryService } from './category.service';
import httpStatus from 'http-status';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const user = (req as Request & { user: { userId: string; role: string } })
    .user;
  const result = await CategoryService.createCategory({
    ...req.body,
    creator: user.userId,
  });
  sendResponse<ICategory>(res, {
    success: true,
    message: 'Category created successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  sendResponse<ICategory[]>(res, {
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getSingleCategory(id);
  sendResponse<ICategory>(res, {
    success: true,
    message: 'Category retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategory(id, req.body);
  sendResponse<ICategory>(res, {
    success: true,
    message: 'Category updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id);
  sendResponse<ICategory>(res, {
    success: true,
    message: 'Category deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
