import { ChangedSymbolEvent, OrdersBookDiffEvent } from '~~/plugins/eventBus';

type BookEntry = [number, number];
type LoadingState = 'no' | 'await_ws_data' | 'await_snapshot';

type Book = {
  symbol: string;
  loadingState: LoadingState;
  lastUpdateId: number;
  bids: BookEntry[];
  asks: BookEntry[];
};

export const useBook = () => {
  const book = useState<Book>('book', () => ({
    lastUpdateId: 0,
    bids: [],
    asks: [],
    loadingState: 'no',
    symbol: '',
  }));

  const { $sdk, $busOn, $busEmit } = useNuxtApp();

  let eventsCache: OrdersBookDiffEvent[] = [];

  $busOn('symbol:changed', (event: ChangedSymbolEvent) => {
    console.log('use-book: need new order book for', event.newSymbol);
    book.value.loadingState = 'await_ws_data';
    book.value.symbol = event.newSymbol;
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

    console.log('use-book: applying diff ', event.data.s);
    // todo: actually apply diff
    // emit: applied diff for other page
  });

  $busOn('sdk:orders-book', (event) => {
    console.log('use-book: new book arrived ', event);

    if (book.value.loadingState === 'await_snapshot') {
      book.value.loadingState = 'no';
      console.log('use-book: awaited snapshot arrived, applying cached events');
      // todo: apply cached events to this book and set it

      eventsCache = [];
    }
  });

  return book;
};
