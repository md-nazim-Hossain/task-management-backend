import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ICategory = {
  _id: string;
  title: string;
  slug: string;
  creator: Types.ObjectId | IUser;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
  status?: string;
  slug?: string;
  creator?: string;
  category?: string;
};
