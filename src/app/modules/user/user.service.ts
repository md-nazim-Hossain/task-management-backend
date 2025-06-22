import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';
import { deleteFile } from '../../../utils/deleteFile';
import { Request } from 'express';
import mongoose from 'mongoose';

const createUser = async (payload: IUser): Promise<Omit<IUser, 'password'>> => {
  const user = new User();
  const isUserExist = await user.isUserExist(payload.email);
  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  const result = await User.create(payload);
  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  const { password, ...userWithoutPassword } = result.toObject();
  return userWithoutPassword;
};

const getAllUsers = async (req: Request): Promise<IUser[]> => {
  const status = req.query.status;
  const filter: Record<string, any> = {};
  if (typeof status === 'string') {
    filter.status = status === 'true';
  }
  const result = await User.find(filter);
  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  return result;
};

const getAllMyUsers = async (userId: string): Promise<IUser[]> => {
  const result = await User.find({
    creator: new mongoose.Types.ObjectId(userId),
  });
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  userId: string
): Promise<IUser | null> => {
  const findUser = await User.findById(id);
  if (!findUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  const creator = findUser.creator;
  if (
    creator &&
    creator._id.toString() !== userId &&
    findUser._id.toString() !== userId
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you are not authorized to update this user'
    );
  }
  if (payload.profileImage && findUser.profileImage) {
    deleteFile(findUser.profileImage);
  }
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteUser = async (
  id: string,
  userId: string
): Promise<IUser | null> => {
  const findUser = await User.findById(id);
  if (!findUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  const creator = findUser.creator;
  if (creator && creator.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you are not authorized to delete this user'
    );
  }
  if (findUser.profileImage) {
    deleteFile(findUser.profileImage);
  }
  const result = await User.findOneAndDelete({ _id: id });
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllMyUsers,
};
