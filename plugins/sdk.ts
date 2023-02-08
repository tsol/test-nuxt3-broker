import { io, Socket } from 'socket.io-client';

class BrokerSDK {
  private socket: Socket | null = null;

  constructor(private $busEmit: Function) {}

  public subscribeToOrdersBook(symbol: string) {
    if (!this.socket) throw Error('SDK: socket not initialized');

    this.socket.emit('want_stream', {
      type: 'depthUpdate',
      symbol,
    });

    this.socket.on('depthUpdate', (data) => {
      //console.log('SDK: order book diff:', data);
      this.$busEmit('sdk:orders-book-diff', { data });
    });
  }

  public async getOrdersBook(symbol: string) {
    const dataRaw = await fetch('/api/orderBook/' + symbol, {
      method: 'GET',
    });
    const data = await dataRaw.json();
    console.log('SDK: get order book:', data);
    this.$busEmit('sdk:orders-book', { data });
  }

  public async init() {
    const dataRaw = await fetch('/api/initServer', {
      method: 'GET',
    });
    const data = await dataRaw.json();
    console.log('SDK: server status:', data);

    const { socketIoUsePort } = useRuntimeConfig();
    this.socket = socketIoUsePort ? io(':' + socketIoUsePort) : io();

    console.log(
      'SDK: server socket created:',
      this.socket,
      ' port ',
      socketIoUsePort
    );

    this.socket.on('connect', () => {
      console.log('SDK: connected');
      this.$busEmit('sdk:connected');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected to websocket server');
      this.$busEmit('sdk:disconnected');
    });

    this.socket.on('message', (message) => {
      console.log('SDK message: ', message);
    });

    this.socket.on('error', (message) => {
      console.error('SDK error: ', message);
      this.$busEmit('toast:error', message);
    });
  }
}

export default defineNuxtPlugin(() => {
  if (process.server) return;

  const app = useNuxtApp();
  const busEmit: any = app.$busEmit;

  return {
    provide: {
      sdk: new BrokerSDK(busEmit),
    },
  };
});
