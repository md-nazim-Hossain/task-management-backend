import { NextFunction, Request, Response } from 'express';

type ICallback<T = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  <T = Request>(fn: ICallback<T>) =>
  async (req: T, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
export { catchAsync };
