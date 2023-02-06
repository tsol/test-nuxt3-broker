# Nuxt 3 Minimal Starter

This is a test task for a job interview. Initial tasks requires
Single Page Application (preferably with SSR, preferably VUE,
well designed, higly reactive, modular - where each page
component can be loaded at runtime.

Initial tasks requests for presense of two 'core' plugins -
EventBus and Binance order book library. And also two pages -
one with live-time updated orders, other with STOCKS selector. Each
one page must affect the other though EventBus.

Design is requested to be Vuetify (and at the same time CSS styling should be BEM).

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

## Updates

1. Initially i was planning to use different pages for my components. But that would
   enevediablly lead to using state manager. Which is ok and cool, but we already have
   an Event-BUS module required. That would just meen an extra step tossing data around -
   since Pinia would be main source of truth. It would work, but i don't think we should overcomplicate things. So we'll make lazy components subscribed to updates from event bus.
