/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

declare global {
  const io: import('socket.io').Server;
}
