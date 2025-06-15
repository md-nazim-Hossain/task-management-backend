import { IUser } from "./user.interface";
import { User } from "./user.model";
import { catchAsync } from "../../../utils/catchAsync";
import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";

const createUser = async (payload: IUser): Promise<IUser> => {
  const user = new User();
  const isUserExist = await user.isUserExist(payload.email);
  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exist");
  }
  const result = await User.create(payload);
  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
  return result;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find();
  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const findUser = await User.findById(id);
  if (!findUser) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  const result = await User.findOneAndUpdate({ id }, payload, {
    new: true,
  });
  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findOneAndDelete({ id });
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
