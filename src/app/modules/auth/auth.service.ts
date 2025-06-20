import httpStatus from 'http-status';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtTokenHelpers } from '../../../helpers/jwtHelpers';
import { hash } from 'bcrypt';
import ApiError from '../../../utils/ApiError';
import { User } from '../user/user.model';
import { Task } from '../task/task.model';
import { Category } from '../category/category.model';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  const user = new User();
  const isUserExit = await user.isUserExist(email);

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //compare password
  const isPasswordMatch = await user.isPasswordMatch(
    password,
    isUserExit.password as string
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  ///access token & refresh token
  const accessToken = jwtTokenHelpers.createToken(
    isUserExit,
    config.jwt.secret as Secret,
    config.jwt.secret_expire_in as number
  );

  const refreshToken = jwtTokenHelpers.createToken(
    isUserExit,
    config.jwt.refresh as Secret,
    config.jwt.refresh_expire_in as number
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifyToken = null;
  try {
    verifyToken = jwtTokenHelpers.verifyToken(
      token,
      config.jwt.refresh as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  }

  const { userId } = verifyToken;

  const user = new User();
  const isUserExist = await user.isUserExist(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //generate new access token
  const newAccessToken = jwtTokenHelpers.createToken(
    isUserExist,
    config.jwt.secret as Secret,
    config.jwt.secret_expire_in as number
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: IChangePassword
): Promise<boolean> => {
  const { oldPassword, newPassword } = payload;
  const userModel = new User();
  const isUserExist = await userModel.isUserExist(user.email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (
    !(await userModel.isPasswordMatch(
      oldPassword,
      isUserExist.password as string
    ))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid old password');
  }

  const newHashPassword = await hash(newPassword, Number(config.bycrypt_salt));

  const updatedData = {
    password: newHashPassword,
    status: true,
    passwordChangeAt: new Date(),
  };

  await User.findOneAndUpdate({ id: user.userId }, updatedData);

  return true;
};

const logOut = async (id: string) => {
  const isUserExist = await User.findOne({ _id: id });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  return true;
};

const dashboardData = async (id: string) => {
  const totalTask = await Task.countDocuments({ creator: id });
  const totalCompletedTask = await Task.countDocuments({
    creator: id,
    status: 'completed',
  });
  const totalInProgressTask = await Task.countDocuments({
    creator: id,
    status: 'in_progress',
  });
  const totalTodoTask = await Task.countDocuments({
    creator: id,
    status: 'todo',
  });

  const totalOverdueTask = await Task.countDocuments({
    creator: id,
    dueDate: { $gt: new Date() },
    status: { $ne: 'completed' },
  });

  const totalUpcomingTask = await Task.countDocuments({
    creator: id,
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' },
  });

  const totalProjects = await Category.countDocuments({ creator: id });
  const data = [
    {
      title: 'Total Project',
      value: totalProjects,
    },
    {
      title: 'Total Task',
      value: totalTask,
    },
    {
      title: 'Completed Task',
      value: totalCompletedTask,
    },
    {
      title: 'In Progress Task',
      value: totalInProgressTask,
    },
    {
      title: 'Todo Task',
      value: totalTodoTask,
    },
    {
      title: 'Overdue Task',
      value: totalOverdueTask,
    },
    {
      title: 'Upcoming Task',
      value: totalUpcomingTask,
    },
  ];
  return data;
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  logOut,
  dashboardData,
};
