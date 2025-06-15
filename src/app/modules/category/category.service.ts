import ApiError from '../../../utils/ApiError';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import httpStatus from 'http-status';

const createCategory = async (payload: ICategory): Promise<ICategory> => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async (): Promise<ICategory[]> => {
  const result = await Category.find();
  return result;
};

const getSingleCategory = async (id: string): Promise<ICategory | null> => {
  const result = await Category.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  return result;
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  const findCategory = await Category.findById(id);
  if (!findCategory)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  const result = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
  const findCategory = await Category.findById(id);
  if (!findCategory)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  const result = await Category.findOneAndDelete({ _id: id });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
