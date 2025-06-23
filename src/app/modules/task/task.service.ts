import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse, IPaginationOptions } from '../../../types';
import ApiError from '../../../utils/ApiError';
import { ITask, ITaskFilters } from './task.interface';
import { Task } from './task.model';
import httpStatus from 'http-status';
import { deleteFile } from '../../../utils/deleteFile';
import { TaskComment } from '../taskComment/task-comment.model';
import { Notification } from '../notification/notification.model';
import { IGroup } from '../group/group.interface';
import { logger } from '../../../utils/logger';
import { notifyUsers } from '../../../helpers/notificationHelper';

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

const getAllTasksByCategory = async (
  filters: ITaskFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { searchTerm, status, priority, slug, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  if (slug) {
    andConditions.push({ 'category.slug': slug });
  }

  if (status) {
    const statusArray = Array.isArray(status) ? status : [status];
    andConditions.push({ status: { $in: statusArray } });
  }

  if (priority) {
    const priorityArray = Array.isArray(priority) ? priority : [priority];
    andConditions.push({ priority: { $in: priorityArray } });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const matchCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortStage: Record<string, 1 | -1> =
    sortBy && sortOrder
      ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
      : { createdAt: -1 };

  const result = await Task.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
        pipeline: [
          {
            $project: {
              title: 1,
              _id: 1,
              slug: 1,
              description: 1,
              status: 1,
            },
          },
        ],
      },
    },
    { $match: matchCondition },
    {
      $lookup: {
        from: 'taskcomments',
        localField: '_id',
        foreignField: 'task',
        as: 'comments',
      },
    },
    {
      $addFields: {
        commentsCount: { $size: '$comments' },
      },
    },
    {
      $lookup: {
        from: 'groups',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'members',
              foreignField: '_id',
              as: 'members',
              pipeline: [
                {
                  $project: {
                    email: 1,
                    fullName: 1,
                    profileImage: 1,
                    _id: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              title: 1,
              _id: 1,
              members: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$assignedTo',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator',
        pipeline: [
          {
            $project: {
              email: 1,
              fullName: 1,
              profileImage: 1,
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$creator',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        status: 1,
        priority: 1,
        dueDate: 1,
        commentsCount: 1,
        creator: 1,
        assignedTo: 1,
        createdAt: 1,
        updatedAt: 1,
        category: 1,
        attachment: 1,
        members: 1,
      },
    },
    { $sort: sortStage },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await Task.countDocuments(matchCondition);

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
): Promise<IGenericResponse<any[]>> => {
  const { searchTerm, status, priority, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  if (status) {
    const statusArray = Array.isArray(status) ? status : [status];
    andConditions.push({ status: { $in: statusArray } });
  }

  if (priority) {
    const priorityArray = Array.isArray(priority) ? priority : [priority];
    andConditions.push({ priority: { $in: priorityArray } });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  andConditions.push({ creator: new mongoose.Types.ObjectId(userId) });

  const matchCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortStage: Record<string, 1 | -1> =
    sortBy && sortOrder
      ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
      : { createdAt: -1 };

  const result = await Task.aggregate([
    { $match: matchCondition },
    {
      $lookup: {
        from: 'taskcomments',
        localField: '_id',
        foreignField: 'task',
        as: 'comments',
      },
    },
    {
      $addFields: {
        commentsCount: { $size: '$comments' },
      },
    },
    {
      $lookup: {
        from: 'groups',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'members',
              foreignField: '_id',
              as: 'members',
              pipeline: [
                {
                  $project: {
                    email: 1,
                    fullName: 1,
                    profileImage: 1,
                    _id: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              title: 1,
              _id: 1,
              members: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$assignedTo',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator',
        pipeline: [
          {
            $project: {
              email: 1,
              fullName: 1,
              profileImage: 1,
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$creator',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
        pipeline: [
          {
            $project: {
              title: 1,
              _id: 1,
              slug: 1,
              description: 1,
              status: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        status: 1,
        priority: 1,
        dueDate: 1,
        commentsCount: 1,
        creator: 1,
        assignedTo: 1,
        createdAt: 1,
        updatedAt: 1,
        category: 1,
        attachment: 1,
        members: 1,
      },
    },
    { $sort: sortStage },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await Task.countDocuments(matchCondition);

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
  if (payload.attachment?.fileUrl && findTask.attachment?.fileUrl) {
    const deletePrevFile = deleteFile(findTask.attachment.fileUrl);
    if (!deletePrevFile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Attachment not found');
    }
  }
  const task = await Task.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  })
    .populate('creator')
    .populate('assignedTo');

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const recipients: string[] = [];

  if (task.creator?._id) recipients.push(task.creator._id.toString());
  if ((task.assignedTo as IGroup)?.members?.length) {
    recipients.push(
      ...(task.assignedTo as IGroup).members.map((m: any) => m._id.toString())
    );
  }

  await notifyUsers({
    message: `Task "${task.title}" has been updated.`,
    userIds: recipients,
    taskId: task._id.toString(),
    senderId: task.creator._id.toString(),
    type: 'task-updated',
  });

  return task;
};

const deleteTask = async (
  id: string,
  userId: string
): Promise<ITask | null> => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  if (task.creator.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this task'
    );
  }

  await TaskComment.deleteMany({ task: id });

  if (task.attachment?.fileUrl) {
    deleteFile(task.attachment.fileUrl);
  }

  const deletedTask = await Task.findByIdAndDelete(id);

  return deletedTask;
};

export const TaskService = {
  createTask,
  getAllTasksByCategory,
  getAllUserTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};
