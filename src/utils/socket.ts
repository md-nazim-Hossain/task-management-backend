import { Server } from 'socket.io';

export const socketHandler = (io: Server) => {
  io.on('connection', socket => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('join', (userId: string) => {
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
