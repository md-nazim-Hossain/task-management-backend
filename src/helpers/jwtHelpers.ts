import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { ICreateToken } from "../types";
import mongoose from "mongoose";

const createToken = (
  payload: Pick<ICreateToken, "email" | "role" | "_id">,
  secret: Secret,
  expiredTime: number = 1000 * 60 * 60 * 24 // default
): string => {
  return jwt.sign(
    {
      userId: new mongoose.Types.ObjectId(payload._id).toString(),
      role: payload.role,
      email: payload.email,
    },
    secret,
    {
      expiresIn: expiredTime,
    } satisfies SignOptions
  );
};

const verifyToken = (token: string, secret: Secret): jwt.JwtPayload => {
  return jwt.verify(token, secret) as jwt.JwtPayload;
};

export const jwtTokenHelpers = {
  createToken,
  verifyToken,
};
