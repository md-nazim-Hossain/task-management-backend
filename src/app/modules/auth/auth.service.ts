import httpStatus from "http-status";
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtTokenHelpers } from "../../../helpers/jwtHelpers";
import { hash } from "bcrypt";
import ApiError from "../../../utils/ApiError";
import { User } from "../user/user.model";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  const user = new User();
  const isUserExit = await user.isUserExist(email);

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  //compare password
  const isPasswordMatch = await user.isPasswordMatch(
    password,
    isUserExit.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
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
    status: isUserExit?.status,
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
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid token");
  }

  const { userId }: any = verifyToken;

  const user = new User();
  const isUserExist = await user.isUserExist(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
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
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  const userModel = new User();
  const isUserExist = await userModel.isUserExist(user.userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }
  if (!(await userModel.isPasswordMatch(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid old password");
  }

  const newHashPassword = await hash(newPassword, Number(config.bycrypt_salt));

  const updatedData = {
    password: newHashPassword,
    status: true,
    passwordChangeAt: new Date(),
  };

  await User.findOneAndUpdate({ id: user.userId }, updatedData);
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
