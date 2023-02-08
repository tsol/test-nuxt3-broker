import { ChangedSymbolEvent, OrdersBookDiffEvent } from '~~/plugins/eventBus';

type LoadingState =
  | 'no'
  | 'await_ws_data'
  | 'await_snapshot'
  | 'await_first_applied';

type Book = {
  symbol: string;
  loadingState: LoadingState;
  lastUpdateId: number;
  bids: Map<number, number>;
  asks: Map<number, number>;
};

export const useBook = () => {
  const book = useState<Book>('book', () => ({
    lastUpdateId: 0,
    bids: new Map<number, number>([]),
    asks: new Map<number, number>([]),
    loadingState: 'no',
    symbol: '',
  }));

  const { $sdk, $busOn, $busEmit } = useNuxtApp();

  let eventsCache: OrdersBookDiffEvent[] = [];

  $busOn('symbol:changed', (event: ChangedSymbolEvent) => {
    if (event.newSymbol === book.value.symbol) {
      console.log('use-book: symbol did not change, no need to reload book');
      return;
    }

    console.log('use-book: need new order book for', event.newSymbol);
    book.value.loadingState = 'await_ws_data';
    book.value.symbol = event.newSymbol;
    book.value.bids.clear();
    book.value.asks.clear();
    eventsCache = [];
    $sdk.subscribeToOrdersBook(event.newSymbol);
  });

  $busOn('sdk:orders-book-diff', (event: OrdersBookDiffEvent) => {
    if (book.value.loadingState === 'await_ws_data') {
      console.log(
        'use-book: first diff arrived, awaiting snapshot',
        event.data.s
      );
      book.value.loadingState = 'await_snapshot';
      $sdk.getOrdersBook(event.s);
    }

    if (book.value.loadingState === 'await_snapshot') {
      console.log(
        'use-book: caching event, while awaiting snapshot',
        event.data.s
      );
      eventsCache.push(event);
      if (eventsCache.length > 100) {
        book.value.loadingState = 'no';
        eventsCache = [];
        $busEmit('toast:error', {
          message: 'Error loading order book. Cache overflow.',
        });
        // todo: cancel snapshot request
      }
      return;
    }

    console.log('use-book: applying diff ', event.data);

    if (!verifyAndApplyEvent(event)) return;
  });

  $busOn('sdk:orders-book', (event) => {
    console.log('use-book: new book arrived ', event);

    if (book.value.loadingState === 'await_snapshot') {
      console.log('use-book: snapshot arrived, applying cached events');

      book.value.loadingState = 'await_first_applied';

      book.value.lastUpdateId = event.data.lastUpdateId;
      event.data.asks.forEach((a: number[]) => book.value.asks.set(a[0], a[1]));
      event.data.bids.forEach((b: number[]) => book.value.asks.set(b[0], b[1]));

      eventsCache = eventsCache.filter(
        (e) => e.data.u > book.value.lastUpdateId
      );

      for (const e of eventsCache) {
        if (!verifyAndApplyEvent(e)) return;
      }

      eventsCache = [];
    }
  });

  const verifyFirstEvent = (e: OrdersBookDiffEvent) => {
    const { u: lastId, U: firstId } = e.data;
    const lastUpdateId = book.value.lastUpdateId;
    return firstId <= lastUpdateId + 1 && lastId > lastUpdateId + 1;
  };

  const verifyNextEvent = (e: OrdersBookDiffEvent) => {
    const { u: lastId, U: firstId } = e.data;
    return firstId === book.value.lastUpdateId + 1;
  };

  const applyMapDiff = (map: Map<number, number>, diff: number[][]) => {
    for (const [price, quantity] of diff) {
      if (quantity === 0) {
        map.delete(price);
      } else {
        map.set(price, quantity);
      }
    }
  };

  const applyDiffEvent = (e: OrdersBookDiffEvent) => {
    const { u: lastId, b: bids, a: asks } = e.data;
    book.value.lastUpdateId = lastId;
    applyMapDiff(book.value.bids, bids);
    applyMapDiff(book.value.asks, asks);
  };

  const verifyAndApplyEvent = (e: OrdersBookDiffEvent) => {
    let verifyFn = verifyNextEvent;

    if (book.value.loadingState === 'await_first_applied') {
      book.value.loadingState = 'no';
      verifyFn = verifyFirstEvent;
    }

    if (!verifyFn(e)) {
      $busEmit('toast:error', {
        message: 'Error loading order book. Invalid event.',
      });
      return false;
    }

    applyDiffEvent(e);

    return true;
  };

  return book;
};
