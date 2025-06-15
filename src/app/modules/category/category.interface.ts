import { Types } from 'mongoose';

export type ICategory = {
  _id: string;
  title: string;
  creator: Types.ObjectId | string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
  creator?: string;
};
