import httpStatus from "http-status";
import { Request, Response } from "express";
import { ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";
import config from "../../../config";
import { catchAsync } from "../../../utils/catchAsync";
import sendResponse from "../../../utils/ApiResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  //set refresh token into cookie
  res.cookie("refreshToken", refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
  });

  sendResponse<ILoginUserResponse>(res, {
    success: true,
    message: "User login successfully",
    data: others,
    statusCode: httpStatus.OK,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse<IRefreshTokenResponse>(res, {
    success: true,
    message: "Get Access Token successfully",
    data: result,
    statusCode: httpStatus.OK,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = (req as Request & { user: { id: string; role: string } }).user;
  const { ...changePasswordData } = req.body;
  await AuthService.changePassword(user, changePasswordData);

  sendResponse(res, {
    success: true,
    message: "Password changed successfully",
    data: null,
    statusCode: httpStatus.OK,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
