// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  plugins: ['~/plugins/vuetify', '~/plugins/eventBus', '~/plugins/sdk'],
  runtimeConfig: {
    apiKey: '',
    apiSecret: '',
    public: {
      symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'],
    },
  },
});
