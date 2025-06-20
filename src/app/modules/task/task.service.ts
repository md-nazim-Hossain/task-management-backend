import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse, IPaginationOptions } from '../../../types';
import ApiError from '../../../utils/ApiError';
import { ITask, ITaskFilters } from './task.interface';
import { Task } from './task.model';
import httpStatus from 'http-status';
import { deleteFile } from '../../../utils/deleteFile';
import { TaskComment } from '../taskComment/task-comment.model';

const createTask = async (payload: ITask): Promise<ITask> => {
  if (
    !payload.assignedTo ||
    !mongoose.Types.ObjectId.isValid(payload.assignedTo as any)
  ) {
    delete payload.assignedTo; // or set it to null
  }
  const result = await Task.create(payload);
  return result;
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
  const task = await Task.findById(id).populate('taskComments');
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
  const [task] = await Promise.all([
    Task.findOneAndDelete({ _id: id }),
    TaskComment.deleteMany({ task: id }),
  ]);

  if (task?.attachment?.fileUrl) {
    deleteFile(task.attachment.fileUrl);
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
