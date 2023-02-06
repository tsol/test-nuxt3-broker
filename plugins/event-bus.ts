import mitt from 'mitt';

export interface SelectedSymbol {
  name: string;
}

export interface OrdersBookDiff {
  data: string;
}

type ApplicationEvents = {
  'symbol:changed': SelectedSymbol;
  'orders-book:diff': OrdersBookDiff;
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
