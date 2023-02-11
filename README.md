# Nuxt 3 Binance Mini View

This is a test task for a job interview. Initial task requires me to build a Single Page Application (preferably with SSR support, preferably in VUE/VUETIFY, well designed, higly reactive, modular blah blah - BUT with each page acting more or less as an independed component,
featuring more or less independent 'core plugins' amongst which are mandatory event bus and binance order book manager.

The GUI components must consist of two pages - one with live-time updated order book for current symbol, other with SYMBOL selector and list of live updates to the order book. Each one page must affect the other through event bus.

## My way of thought: initial plan

1. **Nuxt3**. We probably will want to hide binance API token and have some sort of server api.
   Also SSR is optionally requested. And since Vue, not React - then Nuxt.
   Will take the latest possible version of those and typescript. Lets see if we will need Pinia or not.
   
   Also with lazy components we will achive postponed component load.
   
   Finally Nuxt should be easily deployable to a free hosting right from github. So nuxt 3 it is.

2. **Sockets.IO** Since we will hide API key, we will build something of a proxy on the server side, mimicing the original requests. There will be one REST request for loading up initial state of the order book. And also websockets stream of order book updates. Also the tasks mentioned that we should be carefull managing order book. Luckily i have some experience with Binance API and already aware of the synchronization procedure for the order book.

3. **GUI** Well VUITIFY it is. No problems there in terms of basic GUI. Will use Vuetify 3 ofcourse. How shall we draw an Order Book? Firstly i'll try to find something well designed and simple at github. If nothings there - thats probably where css BEM requirement comes in. Although i might just use vuetify helper classes. As far as a i remember they are as powerfull as Tailwind.

## Updates, how plan unfolds

Day 1. Initially i was planning to use different pages for my components. But that would inevitably lead to using state manager. Which is ok and cool, but we already have an Event-BUS module required by the task. That using state manager will just meen an extra step tossing data around - since Pinia should be main source of truth. It would work, but i don't think we should overcomplicate things. So we'll make lazy components subscribed to updates from event bus.

Day 2. Yeah no pages, only components. Common static stuff now in top component app just drilling down. Components do update them through event bus. Probably will use pinia in the end anyways :)
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

Day 3. Well, Netlify doesnt allow server websockets, so do not vercel and github pages. We could've used github pages proxy, probably, to make our app front-only thats not the way of true Jedi. Server is almost ready and so 99% of the logic. Third day is for GUI.

Make sure not to forget:

- load status (big rotating thing and page darkening)
- connection green/red light in right upper conner
- move name of the page up to app bar
- TOASTS!
- Additional error management

Before that we need to deploy it somewhere. Im thinking heruku for 5$

Day 4. Morning. Got the damn thing deployed at heroku. Stumbled accross following complications:

1. VVirtualScroll no longer is a default and migrated to 'labs' in vuetify3. Make sure to import labs additionally to use DataGrid or VirtualScroll with Vuetify3.

2. By default nuxt is installed as dependency in nuxt3 projects, but while deploying to herou you find out that there is:
 - no 'script run' in package.json - so heruku won't run your code
 - secoundly - the run scripts, that exist - still depend on nuxt, which as devDependency is removed after installation.
 
The workaround i found is a dirty one - just transfer nuxt from dev to normal dependencies. And when its running as it should -
figure out what is the correct 'npm run start' script should look like.

P.S. Had to fix some issues with the code regarding correct order book fetch and update, as well as error management.
Ofcourse by this time project requires a complete refacotring with updated purposes in mind. 

