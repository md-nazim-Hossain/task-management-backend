import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse, IPaginationOptions } from '../../../types';
import ApiError from '../../../utils/ApiError';
import { generateUniqueSlug } from '../../../utils/slug-generator';
import { ICategory, ICategoryFilters } from './category.interface';
import { Category } from './category.model';
import httpStatus from 'http-status';

const createCategory = async (payload: ICategory): Promise<ICategory> => {
  const slug = await generateUniqueSlug(payload.title, Category);
  payload.slug = slug;
  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICategory[]>> => {
  const { searchTerm, status, creator, category } = filters;
  const { page, limit } =
    paginationHelpers.calculatePagination(paginationOptions);

  const pipeline = [];
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ],
      },
    });
  }

  if (creator) {
    pipeline.push({
      $match: {
        creator: creator,
      },
    });
  }

  if (category) {
    pipeline.push({
      $match: {
        _id: category,
      },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: 'category',
        as: 'tasks',
        pipeline: [
          {
            $lookup: {
              from: 'taskcomments',
              let: { taskId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$task', '$$taskId'] },
                  },
                },
                {
                  $count: 'count',
                },
              ],
              as: 'comments',
            },
          },
          {
            $addFields: {
              commentsCount: {
                $cond: {
                  if: { $gt: [{ $size: '$comments' }, 0] },
                  then: { $arrayElemAt: ['$comments.count', 0] },
                  else: 0,
                },
              },
            },
          },
          {
            $project: {
              comments: 0,
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
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'category',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    slug: 1,
                    description: 1,
                    status: 1,
                  },
                },
              ],
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
                          fullName: 1,
                          email: 1,
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
                    members: 1,
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
              path: '$assignedTo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$category',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        completedTasksCount: {
          $size: {
            $filter: {
              input: '$tasks',
              as: 'task',
              cond: { $eq: ['$$task.status', 'completed'] },
            },
          },
        },
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
      $project: {
        title: 1,
        slug: 1,
        status: 1,
        createdAt: 1,
        creator: 1,
        tasks: 1,
        completedTasksCount: 1,
      },
    }
  );

  if (status) {
    const statusArray = Array.isArray(status) ? status : [status];
    pipeline.push({
      $match: {
        tasks: {
          $elemMatch: {
            status: { $in: statusArray },
          },
        },
      },
    });
  }

  const result = await Category.aggregate(pipeline);
  const total = await Category.countDocuments(pipeline);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>,
  userId: string
): Promise<ICategory | null> => {
  const findCategory = await Category.findById(id);
  if (!findCategory)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  if (findCategory.creator.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you are not authorized to update this category'
    );
  }
  const result = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCategory = async (
  id: string,
  userId: string
): Promise<ICategory | null> => {
  const findCategory = await Category.findById(id);
  if (!findCategory)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  if (findCategory.creator.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you are not authorized to delete this category'
    );
  }
  const result = await Category.findOneAndDelete({ _id: id });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
