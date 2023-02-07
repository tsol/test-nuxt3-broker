<template>
  <v-app>
    <v-card>
      <v-layout>

        <v-app-bar color="primary" class="w-100" density="compact">
          <template v-slot:prepend>
            <v-btn @click.stop="toggleDrawer()" icon="mdi-menu" />
          </template>

          <v-app-bar-title>Nuxt3-TS-Broker</v-app-bar-title>

          <template v-slot:append>
            <v-btn icon="mdi-dots-vertical"></v-btn>
          </template>

        </v-app-bar>


        <Teleport to="body">
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
                <orders-book :current-symbol="currentSymbol" />
              </v-window-item>

              <v-window-item value="change-symbol">
                <LazySymbolChange :current-symbol="currentSymbol" :symbols="symbols" />
              </v-window-item>

            </v-window>
          </keep-alive>
        </v-main>


      </v-layout>
    </v-card>

  </v-app>
</template>
   
<script lang="ts" setup>
import { ref } from "vue";
const { $listen } = useNuxtApp();

// we don't use store yet, since only current symbol is needed in state
// all rest is fast changing temporary data from event-bus

const currentSymbol = ref("BTCUSDT");
const symbols = ref(['BTCUSDT', 'SOLUSDT', 'ETHUSDT']);

const drawer = ref(false);
const tab = ref<"orders-book" | "change-symbol">("orders-book")

$listen('symbol:changed', (event) => {
  currentSymbol.value = event.newSymbol;
});

const closeDrawer = () => { drawer.value = false; };
const toggleDrawer = () => { drawer.value = !drawer.value; };

</script>


