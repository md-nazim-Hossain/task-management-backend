import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IGroup = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  creator: Types.ObjectId | IUser;
  members: Array<Types.ObjectId | IUser>;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IGroupFilters = {
  searchTerm?: string;
  creator?: string;
  status?: string;
  userId?: string;
};
