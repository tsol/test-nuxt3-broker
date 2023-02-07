import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  if (process.server) return;
  const socket = null;
  /*
  socket.on('connect', () => {
    console.log('connected to websocket server');
  });

  socket.on('custom event', (data) => {
    console.log('received custom event:', data);
  });

  socket.emit('custom event', { message: 'Hello from client' });
*/
  return {
    provide: {
      socket,
    },
  };
});
