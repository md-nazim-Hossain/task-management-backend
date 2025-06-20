import mongoose, { Error } from 'mongoose';
import config from './config/index';
import { createServer, Server } from 'http'; // use createServer
import { errorLogger, logger } from './utils/logger';
import app from './app';
import { Server as SocketIOServer } from 'socket.io';

let server: Server;
let io: SocketIOServer; // declare socket server

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    logger.info('Database connected successfully!');
    server = createServer(app);
    io = new SocketIOServer(server, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });

    io.on('connection', socket => {
      logger.info(`🔌 User connected: ${socket.id}`);
      socket.on('join', (userId: string) => {
        socket.join(userId);
      });
      socket.on('disconnect', () => {
        logger.info(`❌ User disconnected: ${socket.id}`);
      });
    });

    global.io = io;
    server.listen(config.port, () => {
      logger.info(`🚀 Server listening on port ${config.port}`);
    });
  } catch (error: Error | unknown) {
    errorLogger.error(
      'Failed to connect to database',
      error instanceof Error ? error.message : error
    );
  }

  process.on('unhandledRejection', (error: any) => {
    console.log('Unhandled Rejection. Shutting down server...', error);
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM is received');
    if (server) server.close();
  });
}
