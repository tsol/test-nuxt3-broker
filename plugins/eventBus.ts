import mitt from 'mitt';

export type ChangedSymbolEvent = {
  newSymbol: string;
};

export type OrdersBookEvent = {
  data: any;
};

export type OrdersBookDiffEvent = {
  data: any;
};

export type ToastErrorEvent = {
  message: string;
};

export type ToastMessageEvent = {
  message: string;
};

type ApplicationEvents = {
  'symbol:changed': ChangedSymbolEvent;
  'sdk:orders-book': OrdersBookEvent;
  'sdk:orders-book-diff': OrdersBookDiffEvent;
  'sdk:connected': void;
  'sdk:disconnected': void;
  'toast:error': ToastErrorEvent;
  'toast:message': ToastErrorEvent;
};

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>();

  return {
    provide: {
      busEmit: emitter.emit,
      busOn: emitter.on,
    },
  };
});
