import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorsHandler.middleware';
import { routes } from './app/routes';
const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Application route
app.use('/api/v1', routes);

//global error handler
app.use(globalErrorHandler);

//handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'Api Not found',
      },
    ],
  });

  next();
});
export default app;
