import { Types } from 'mongoose';
import { ITask } from '../task/task.interface';
import { IUser } from '../user/user.interface';

export type ITaskComment = {
  _id?: Types.ObjectId | string;
  task: Types.ObjectId | ITask;
  author: Types.ObjectId | IUser;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
};
