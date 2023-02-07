import { Server } from 'socket.io';

declare global {
  var socketServer: Server;
}

function createServer() {
  const io = new Server(3005, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Connection', socket.id);
  });

  io.on('connect', (socket) => {
    socket.emit('message', `welcome ${socket.id}`);
    socket.broadcast.emit('message', `${socket.id} joined`);

    socket.on('message', function message(data: any) {
      console.log('message received: %s', data);
      socket.emit('message', { data });
    });

    socket.on('disconnecting', () => {
      console.log('disconnected', socket.id);
      socket.broadcast.emit('message', `${socket.id} left`);
    });
  });

  return io;
}

export default defineEventHandler((event) => {
  if (!global.socketServer) {
    global.socketServer = createServer();
    return { server: 'just_created' };
  }
  return { server: 'already_existed' };
  // wss = new WebSocketServer({ server: event.node.res.socket?.server })
});
