import { MainClient } from 'binance';

const client = new MainClient({
  beautifyResponses: false,
});

export default defineEventHandler((event) => {
  return client.getOrderBook({
    symbol: event.context.params.symbol,
    limit: 500,
  });
});
