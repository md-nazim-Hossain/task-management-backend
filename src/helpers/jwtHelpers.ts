import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { ICreateToken } from "../types";

const createToken = (
  payload: Pick<ICreateToken, "id" | "role">,
  secret: Secret,
  expiredTime: number = 1000 * 60 * 60 * 24 // default
): string => {
  return jwt.sign(
    {
      userId: payload.id,
      role: payload.role,
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
