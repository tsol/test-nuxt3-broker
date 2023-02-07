import mitt from 'mitt';

export interface ChangeSymbolEvent {
  newSymbol: string;
}

export interface OrdersBookDiffEvent {
  data: string;
}

type ApplicationEvents = {
  'symbol:changed': ChangeSymbolEvent;
  'orders-book:diff': OrdersBookDiffEvent;
};

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>();

  return {
    provide: {
      event: emitter.emit,
      listen: emitter.on,
    },
  };
});
