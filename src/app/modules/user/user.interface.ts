/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export type IUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: boolean;
  passwordChangeAt?: Date;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IUserMethods = {
  isPasswordMatch: (
    givenPass: string,
    savePassword: string
  ) => Promise<boolean>;
  isUserExist: (
    id: string
  ) => Promise<Pick<IUser, "id" | "password" | "status" | "role"> | null>;
};
export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
