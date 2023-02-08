<template>
  <v-app>
    <ClientOnly>

      <v-layout :full-height="true">

        <v-app-bar color="primary" class="w-100" density="compact">
          <template v-slot:prepend>
            <v-btn @click.stop="toggleDrawer()" icon="mdi-menu" />
          </template>

          <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>

          <template v-slot:append>

            <v-icon v-if="connected" color="green">
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else color="red">
              mdi-close-circle
            </v-icon>


            <!--<v-btn icon="mdi-dots-vertical"></v-btn>-->
          </template>

        </v-app-bar>


        <Teleport to="body">

          <MyToast />

          <v-navigation-drawer v-model="drawer" temporary>
            <v-list>
              <v-list-item prepend-avatar="/avatars/cartoon-harry.jpeg" title="Igor Kravets"></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-tabs @update:model-value="closeDrawer" v-model="tab" direction="vertical" color="primary">

              <v-tab value="orders-book">
                <v-icon start>mdi-view-dashboard</v-icon>
                Orders Book
              </v-tab>

              <v-tab value="change-symbol">
                <v-icon start>mdi-bitcoin</v-icon>
                Change Symbol
              </v-tab>

            </v-tabs>

          </v-navigation-drawer>
        </Teleport>

        <v-main>
          <keep-alive>

            <v-window v-model="tab">

              <v-window-item value="orders-book">
                <PageOrdersBook />
              </v-window-item>

              <v-window-item value="change-symbol">
                <LazyPageSymbolChange :current-symbol="currentSymbol" :symbols="symbols" />
              </v-window-item>

            </v-window>

          </keep-alive>

        </v-main>

      </v-layout>

    </ClientOnly>
  </v-app>
</template>
   
<script lang="ts" setup>

import { ChangedSymbolEvent } from './plugins/eventBus';

const config = useRuntimeConfig();
const { $sdk, $busOn, $busEmit } = useNuxtApp();

const connected = ref(false);
const symbols = ref(config.symbols);
const currentSymbol = ref(symbols.value[0]);

const drawer = ref(false);
const tab = ref<"orders-book" | "change-symbol">("orders-book")

const closeDrawer = () => { drawer.value = false; };
const toggleDrawer = () => { drawer.value = !drawer.value; };

$busOn('sdk:connected', () => {
  connected.value = true;
  $busEmit('symbol:changed', { newSymbol: currentSymbol.value });
});

$busOn('sdk:disconnected', () => { connected.value = false; });

$busOn('symbol:changed', (event: ChangedSymbolEvent) => {
  currentSymbol.value = event.newSymbol;
});

$busOn('toast:error', (event: { message: string }) => {
  console.error('app: toast:error: ', event.message);
});

onMounted(() => {
  console.log('app: onMounted');
  $sdk.init();
});

const pageTitle = computed(() => {
  const pages = {
    'orders-book': 'Orders Book',
    'change-symbol': 'Change Symbol',
  };
  return `${pages[tab.value]}: ${currentSymbol.value}`;
});

</script>

<style>
html {
  overflow: hidden;
}

/*
main {
  width: 100vw;
  height: calc(100vh - 48px);
  flex-direction: column;
  overflow: scroll;
  overflow-x: hidden;
  margin-top: 48px;
  padding-top: 0 !important;
}
*/
</style>