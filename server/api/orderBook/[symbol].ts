import { MainClient } from 'binance';

//const config = useRuntimeConfig();
//console.log('API secret:', config.apiKey);

const client = new MainClient({
  beautifyResponses: true,
});

//console.log('getAvgPrice: ', await client.getAvgPrice({ symbol: 'BTCUSDT' }));
//console.log('getExchangeInfo: ', JSON.stringify(await client.getExchangeInfo(), null, 2));

export default defineEventHandler((event) =>
  client.getOrderBook({ symbol: 'BTCUSDT', limit: 5 })
);
