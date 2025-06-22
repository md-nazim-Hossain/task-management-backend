import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse, IPaginationOptions } from '../../../types';
import { IGroup, IGroupFilters } from './group.interface';
import { Group } from './group.model';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';
import { deleteFile } from '../../../utils/deleteFile';

const createGroup = async (payload: IGroup): Promise<IGroup> => {
  const result = await Group.create(payload);
  return result;
};

const getAllGroups = async (): Promise<IGroup[]> => {
  const result = await Group.find().populate(
    'creator',
    '+email +fullName +_id +profileImage'
  );
  return result;
};

const getAllMyGroups = async (
  filters: IGroupFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IGroup[]>> => {
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
    members: { $in: [filtersData.userId] },
  });

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Group.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('creator', '+email +fullName +_id +profileImage');

  const total = await Group.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleGroup = async (id: string): Promise<IGroup | null> => {
  const result = await Group.findById(id).populate(
    'creator',
    '+email +fullName +_id +profileImage'
  );
  return result;
};

const updateGroup = async (
  id: string,
  payload: Partial<IGroup>,
  userId: string
): Promise<IGroup | null> => {
  const findGroup = await Group.findById(id);
  if (!findGroup) throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  if (findGroup.creator.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you are not authorized to update this group'
    );
  }
  if (payload.image && findGroup.image) {
    deleteFile(findGroup.image);
  }
  const result = await Group.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteGroup = async (
  id: string,
  userId: string
): Promise<IGroup | null> => {
  const findGroup = await Group.findById(id);
  if (!findGroup) throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  if (findGroup.creator.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you are not authorized to delete this group'
    );
  }
  const result = await Group.findOneAndDelete({ _id: id });
  if (findGroup.image) {
    deleteFile(findGroup.image);
  }
  return result;
};

export const GroupService = {
  createGroup,
  getAllGroups,
  getAllMyGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
};
