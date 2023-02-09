import mitt from 'mitt';

export type OrdersBookDiffEvent = {
  data: any;
};

export type BusEvents = {
  'symbol:changed': { newSymbol: string };
  'sdk:orders-book': { symbol: string; data: any };
  'sdk:orders-book-diff': OrdersBookDiffEvent;
  'sdk:connected': void;
  'sdk:disconnected': void;
  'toast:error': { message: string };
  'toast:message': { message: string };
};

export default defineNuxtPlugin(() => {
  const emitter = mitt<BusEvents>();
  return {
    provide: {
      busEmit: emitter.emit,
      busOn: emitter.on,
    },
  };
});
