import { Request, Response } from 'express';
import sendResponse from '../../../utils/ApiResponse';
import { catchAsync } from '../../../utils/catchAsync';
import { ICategory } from './category.interface';
import { CategoryService } from './category.service';
import httpStatus from 'http-status';
import pick from '../../../utils/pick';
import { CategoryConstant } from './category.constant';
import { IPaginationOptions } from '../../../types';
import { paginationFields } from '../../../utils/paginationConstant';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
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
  const filters = pick(req.query, CategoryConstant.categoryFiltersFields);
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields
  );

  const result = await CategoryService.getAllCategories(
    filters,
    paginationOptions
  );
  sendResponse<ICategory[]>(res, {
    success: true,
    message: 'Categories retrieved successfully',
    data: result.data,
    meta: result.meta,
    statusCode: httpStatus.OK,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategory(
    id,
    req.body,
    req.user.userId
  );
  sendResponse<ICategory>(res, {
    success: true,
    message: 'Category updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id, req.user.userId);
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
  updateCategory,
  deleteCategory,
};
