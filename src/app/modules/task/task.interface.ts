import { Types } from 'mongoose';
import { ENUM_TASK_PRIORITY, ENUM_TASK_STATUS } from '../../../types/enum';
import { IUser } from '../user/user.interface';
import { IGroup } from '../group/group.interface';

export type ITask = {
  _id?: string;
  title: string;
  description: string;
  status?: ENUM_TASK_STATUS;
  creator: Types.ObjectId | IUser;
  dueDate: string;
  assignedTo?: Types.ObjectId | IGroup | string;
  category: Types.ObjectId | string;
  priority?: ENUM_TASK_PRIORITY;
  attachment?: ITaskAttachment;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ITaskFilters = {
  searchTerm?: string;
  creator?: string;
  status?: string;
  category?: string;
  dueDate?: Date;
  priority?: string;
  assignedTo?: string;
};

export type ITaskAttachment = {
  fileName: string;
  fileUrl: string;
  mimeType: string;
};
