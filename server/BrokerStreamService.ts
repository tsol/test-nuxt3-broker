import { DefaultLogger, WebsocketClient } from 'binance';

export const BROKER_STREAM_TYPES: string[] = ['depthUpdate', 'kline'];

export type BrokerStreamType = 'depthUpdate' | 'kline';

export function isBrokerStreamType(value: string): value is BrokerStreamType {
  return BROKER_STREAM_TYPES.includes(value);
}

export type BrokerStreamHandler = (type: BrokerStreamType, data: any) => void;

type BrokerStream = {
  type: BrokerStreamType;
  symbol: string;
  ws: WebSocket;
  handlers: BrokerStreamHandler[];
};

function streamId({ type, symbol }: Pick<BrokerStream, 'type' | 'symbol'>) {
  return `${type}-${symbol}`;
}

export default class BrokerStreamService {
  private wsClient: WebsocketClient;

  private streams: Record<string, BrokerStream> = {};

  constructor() {
    const { apiKey, apiSecret } = useRuntimeConfig();
    let wsKey;

    const logger = {
      ...DefaultLogger,
      silly: () => {},
      debug: () => {},
      info: () => {},
      notice: () => {},
      warning: () => {},
      error: () => {},
    };

    this.wsClient = new WebsocketClient(
      {
        api_key: apiKey,
        api_secret: apiSecret,
        beautify: true,
      },
      logger
    );

    this.wsClient.on('open', (data) => {
      console.log(
        'BROKER: connection opened:',
        data.wsKey,
        data.ws.target?.url
      );
      wsKey = data.wsKey;
    });

    this.wsClient.on('close', (data) => {
      console.log(
        'BROKER: connection closed:',
        data.wsKey,
        data.ws.target?.url
      );
      wsKey = data.wsKey;
    });

    this.wsClient.on('reconnecting', (data) => {
      console.log('BROKER: ws automatically reconnecting.... ', data?.wsKey);
    });

    this.wsClient.on('reconnected', (data) => {
      console.log('BROKER: ws has reconnected ', data?.wsKey);
    });

    this.wsClient.on('message', (data) => {
      if (Array.isArray(data)) {
        console.log('BROKER: array message');
        return;
      }

      if (!isBrokerStreamType(data.e)) {
        console.log('BROKER: unknown event type recieved');
        return;
      }

      if (!('s' in data)) return;

      this.broadcast(data.e, data.s, data);
    });
  }

  private broadcast(type: BrokerStreamType, symbol: string, data: any) {
    const stream = this.streams[streamId({ type, symbol })];
    if (stream) {
      stream.handlers.forEach((handler) => handler(type, data));
    }
  }

  private subscribeToBroker(
    streamType: BrokerStreamType,
    symbol: string
  ): WebSocket {
    switch (streamType) {
      case 'depthUpdate':
        return this.wsClient.subscribeDiffBookDepth(symbol, 1000, 'spot');

      case 'kline':
        return this.wsClient.subscribeKlines(symbol, '1m', 'spot');
    }
  }

  public subscribe(
    type: BrokerStreamType,
    symbol: string,
    handler: BrokerStreamHandler
  ) {
    const stream = this.streams[streamId({ type, symbol })];

    if (stream) {
      stream.handlers.push(handler);
      return;
    }

    const newStream = {
      type,
      symbol,
      handlers: [handler],
      ws: this.subscribeToBroker(type, symbol),
    };

    this.streams[streamId(newStream)] = newStream;
  }

  public unsubscribeAll(handler: BrokerStreamHandler) {
    Object.values(this.streams).forEach((stream) => {
      this.removeHandlerFromStream(stream, handler);
    });
  }

  public unsubscribe(
    type: BrokerStreamType,
    symbol: string,
    handler: BrokerStreamHandler
  ) {
    const stream = this.streams[streamId({ type, symbol })];

    if (!stream) {
      console.log('BROKER: stream not found');
      return;
    }

    this.removeHandlerFromStream(stream, handler);
  }

  private removeHandlerFromStream(
    stream: BrokerStream,
    handler: BrokerStreamHandler
  ) {
    stream.handlers = stream.handlers.filter((h) => h !== handler);

    if (stream.handlers.length === 0) {
      this.wsClient.closeWs(stream.ws);
      delete this.streams[streamId(stream)];
    }
  }
}
