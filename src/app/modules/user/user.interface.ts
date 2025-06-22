/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: boolean;
  passwordChangeAt?: Date;
  profileImage?: string;
  password: string;
  creator: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IUserMethods = {
  isPasswordMatch: (
    givenPass: string,
    savePassword: string
  ) => Promise<boolean>;
  isUserExist: (
    email: string
  ) => Promise<Pick<
    IUser,
    'email' | 'password' | 'status' | 'role' | '_id'
  > | null>;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
