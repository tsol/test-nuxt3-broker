import SocketServer from '../SocketServer';

// declare global {
//   var socketServer: SocketServer;
// }

var socketServer: SocketServer | null = null;

export default defineEventHandler((event) => {
  if (!socketServer) {
    const httpServer = (event.node.req.socket as any).server;
    socketServer = new SocketServer(httpServer);
    return { server: 'just_created' };
  }
  return { server: 'already_existed' };
});
