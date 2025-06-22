/* eslint-disable no-var */
import { Server as SocketIOServer } from 'socket.io';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }

  var io: SocketIOServer;

  interface GlobalThis {
    io: SocketIOServer;
  }
}

export {};
