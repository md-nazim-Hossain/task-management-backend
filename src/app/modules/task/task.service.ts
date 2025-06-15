import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse, IPaginationOptions } from '../../../types';
import ApiError from '../../../utils/ApiError';
import { ITask, ITaskFilters } from './task.interface';
import { Task } from './task.model';
import httpStatus from 'http-status';
import { deleteFile } from '../../../utils/deleteFile';

const createTask = async (payload: ITask): Promise<ITask> => {
  return await Task.create(payload);
};

const getAllTasks = async (
  filters: ITaskFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITask[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: [
        {
          title: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ],
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Task.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllUserTasks = async (
  userId: string,
  filters: ITaskFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITask[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: [
        {
          title: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ],
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  andConditions.push({
    creator: userId,
  });

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Task.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleTask = async (id: string): Promise<ITask | null> => {
  const task = await Task.findById(id);
  return task;
};

const updateTask = async (
  id: string,
  payload: Partial<ITask>
): Promise<ITask | null> => {
  const findTask = await Task.findById(id);
  if (!findTask) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  if (payload.attachment && findTask.attachment) {
    const deletePrevFile = deleteFile(findTask.attachment.fileUrl);
    if (!deletePrevFile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Attachment not found');
    }
  }
  const task = await Task.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  return task;
};

const deleteTask = async (id: string): Promise<ITask | null> => {
  const findTask = await Task.findById(id);
  if (!findTask) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  const task = await Task.findOneAndDelete({ _id: id });
  if (findTask.attachment) {
    deleteFile(findTask.attachment.fileUrl);
  }
  return task;
};

export const TaskService = {
  createTask,
  getAllTasks,
  getAllUserTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};
