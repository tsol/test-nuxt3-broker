# Nuxt 3 Binance Mini View

This is a test task for a job interview. Initial task requires me to build a
Single Page Application (preferably with SSR support, preferably in VUE/VUETIFY,
well designed, higly reactive, modular - where each page component can be loaded at runtime.

Initial tasks requests for presense of two 'core' plugins - EventBus and Binance order book library. And also two pages - one with live-time updated orders, other with STOCKS selector. Each one page must affect the other though EventBus.

## My way of thought: initial plan

1. **Nuxt3**. We probably will want to hide binance API token and have some sort of server api.
   Also SSR is optionally requested. And since Vue, not React - then Nuxt.
   Will take the latest possible version and typescript. Different pages and Pinia if we will need be needed.

Also with lazy components we will achive postponed component load.

Finally Nuxt should be easily deployable to a free hosting right from github. So nuxt. 3.

2. **Sockets.IO** Since we will hide API key, we will build something of a proxy on the server
   side, mimicing the original requests. There will be one REST request for loading up initial state. And also websockets stream of Order Book updates. Also the tasks mentioned that we should be carefull managing order book. Luckily i have some experience with Binance API and already aware of the synchronization procedure for order book.

3. **GUI** Well VUITIFY it is. No problems there in terms of basic GUI. Will use
   Vuetify 3 ofcourse. How shall we draw an Order Book? Firstly i'll try to find something
   well designed and simple at github. If now - thats probably where css BEM comes in. Although
   i might just use vuetify style classes. As far as a i remember they as powerfull as Tailwind.

## Updates, how plan unfolds

1. Initially i was planning to use different pages for my components. But that would
   inevitably lead to using state manager. Which is ok and cool, but we already have
   an Event-BUS module required. That would just meen an extra step tossing data around -
   since Pinia would be main source of truth. It would work, but i don't think we should overcomplicate things. So we'll make lazy components subscribed to updates from event bus.

2. Yeah no pages, only components. Common static stuff now in top component app just drilling down.
   Components do update them through event bus. Probably will use pinia in the end anyways :)
   Anyhow, task for today is:

- deploy SocketsIO server in nuxt3
- make sure we can communicate with it from the components
- IMPORTANT: deploy code to Netlify and make sure it still works

Thus last option is crutial and might actually take some time debugging.

- also check how lazy components work in production
- once everything works with Netlify - start creating server proxy

Probably we will just proxy everything more or less as is from binance at this point:
both REST order book state request and WEBSOCKET stream. Combine logic would run on client side.
On client disconnect the server connection to the binance also stops.
We can arrange the streams by topic and disconnect upon last subscription on the topic.

That will be day 2. Day three will be all about drawing order book with proper scrolling.

3.
