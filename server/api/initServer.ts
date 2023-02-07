import SocketServer from '../SocketServer';

// declare global {
//   var socketServer: SocketServer;
// }

var socketServer: SocketServer | null = null;

export default defineEventHandler((event) => {
  if (!socketServer) {
    socketServer = new SocketServer();
    return { server: 'just_created' };
  }
  return { server: 'already_existed' };
});
