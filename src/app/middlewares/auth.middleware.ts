/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { jwtTokenHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../../utils/ApiError';

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token from header
      let token = (req.headers?.authorization ||
        req.headers?.Authorization ||
        req.cookies?.accessToken) as string;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
      }

      if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }

      //verify token
      const verifiedUser = jwtTokenHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      return next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
