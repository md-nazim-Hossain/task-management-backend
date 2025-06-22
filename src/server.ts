import mongoose from 'mongoose';
import config from './config/index';
import { createServer } from 'http';
import { logger, errorLogger } from './utils/logger';
import app from './app';
import { Server as SocketIOServer } from 'socket.io';
import { socketHandler } from './utils/socket';
import { startDueDateNotifier } from './jobs/taskDueNotifier';

let server: ReturnType<typeof createServer>;

process.on('uncaughtException', error => {
  errorLogger.error('Uncaught Exception:', error);
  process.exit(1);
});

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    logger.info('✅ Database connected successfully!');

    server = createServer(app);
    const io = new SocketIOServer(server, {
      cors: {
        origin: ['http://localhost:5173', 'https://projectify.coderbangla.com'],
        credentials: true,
      },
    });

    globalThis.io = io;
    socketHandler(io);

    server.listen(config.port, () => {
      logger.info(`🚀 Server listening on port ${config.port}`);
      startDueDateNotifier();
    });
  } catch (error: any) {
    errorLogger.error('❌ Database connection failed:', error.message || error);
  }

  process.on('unhandledRejection', (error: any) => {
    errorLogger.error('Unhandled Rejection. Shutting down...', error);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

main();

if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Closing server.');
    if (server) server.close();
  });
}
