import { Server, Socket } from 'socket.io';

import BrokerStreamService, {
  BrokerStreamType,
  BrokerStreamHandler,
  isBrokerStreamType,
} from './BrokerStreamService';

type Client = {
  socket: Socket;
  handleFn: BrokerStreamHandler;
};

function clientHandlerFactory(socket: Socket): BrokerStreamHandler {
  return (type: BrokerStreamType, data: any) => {
    socket.emit(type, data);
  };
}

export default class SocketServer {
  private io: Server;
  private brokerStreams: BrokerStreamService;
  private symbols: string[];
  private clients: Record<string, Client> = {};

  constructor(useServer: any) {
    const config = useRuntimeConfig();
    this.symbols = config.public.symbols;
    this.io = this.createServerIO(useServer);
    this.brokerStreams = new BrokerStreamService();
  }

  isValidSymbol(symbol: string): boolean {
    return this.symbols.includes(symbol);
  }

  private clientSubscribe(
    socket: Socket,
    type: BrokerStreamType,
    symbol: string
  ) {
    let client = this.clients[socket.id];

    if (!client) {
      client = this.clients[socket.id] = {
        socket,
        handleFn: clientHandlerFactory(socket),
      };
    } else {
      this.brokerStreams.unsubscribeAll(client.handleFn);
    }

    this.brokerStreams.subscribe(type, symbol, client.handleFn);
  }

  private clientDisconnect(socket: Socket) {
    const client = this.clients[socket.id];
    if (client) {
      this.brokerStreams.unsubscribeAll(client.handleFn);
    }
    delete this.clients[socket.id];
  }

  private createServerIO(useServer: any) {
    // todo: move to settings

    // const io = new Server(3006, {
    //   cors: {
    //     origin: '*',
    //   },
    // });

    const io = new Server(useServer, {
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('SS: connection', socket.id);
    });

    io.on('connect', (socket) => {
      socket.emit('message', `welcome ${socket.id}`);

      socket.on('want_stream', (data) => {
        const { type, symbol } = data;

        if (!this.isValidSymbol(symbol))
          return this.err(socket, 'Invalid symbol');

        if (!isBrokerStreamType(type)) return this.err(socket, 'Invalid type');

        console.log('SS:', `client ${socket.id} subscribed ${type} ${symbol}`);
        this.clientSubscribe(socket, type, symbol);
      });

      socket.on('disconnecting', () => {
        console.log('SS:', `client disconnect ${socket.id}`);
        this.clientDisconnect(socket);
      });
    });

    return io;
  }

  private err(socket: Socket, text: string) {
    console.error('SS:', text);
    socket.emit('error', text);
  }
}
