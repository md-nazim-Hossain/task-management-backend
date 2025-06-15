import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { ZodError } from 'zod';
import config from '../../config';
import { errorLogger } from '../../utils/logger';
import { IGenericErrorMessage } from '../../types';
import handleValidationError from '../../utils/handleValidationError';
import handleZodError from '../../utils/handleZodError';
import handleCastError from '../../utils/handleCastError';
import ApiError from '../../utils/ApiError';

//global error handler
const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.env === 'development') {
    console.log('GlobalErrorHandler', error);
  } else {
    errorLogger.error(error);
  }

  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error.stack : undefined,
  });
};

export default globalErrorHandler;
