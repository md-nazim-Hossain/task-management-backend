import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';
import { deleteFile } from '../../../utils/deleteFile';

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

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find();
  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const findUser = await User.findById(id);
  if (!findUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  if (payload.profileImage && findUser.profileImage) {
    deleteFile(findUser.profileImage);
  }
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const findUser = await User.findById(id);
  if (!findUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
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
};
