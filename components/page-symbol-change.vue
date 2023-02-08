<template>

  <v-card class="ma-10 mx-auto" elevation="15" max-width="1024">

    <v-card-title class="white--text orange darken-4">
      Select symbol
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-10">
      <v-select :model-value="currentSymbol" @update:model-value="changeSymbol($event)" label="Symbol" :items="symbols"
        variant="solo"></v-select>

      <v-divider></v-divider>
      <ul>
        <li v-for="event in lastDiffEvents" :key="event.data.e">
          {{ event.data.s }}: {{ event.data.E }}
        </li>
      </ul>

    </v-card-text>

  </v-card>



</template>


<script lang="ts" setup>

import { OrdersBookDiffEvent } from '~~/plugins/eventBus';

defineProps<{
  currentSymbol: string
  symbols: string[]
}>();

const MAX_EVENTS = 10;

const { $busOn, $busEmit } = useNuxtApp();

const lastDiffEvents = ref<OrdersBookDiffEvent[]>([]);

$busOn('sdk:orders-book-diff', (event) => {
  lastDiffEvents.value.push(event);
  if (lastDiffEvents.value.length > MAX_EVENTS) {
    lastDiffEvents.value.shift();
  }
});

const changeSymbol = (symbol: string) => {
  $busEmit('symbol:changed', { newSymbol: symbol });
  $busEmit('toast:message', { message: `Symbol changed to ${symbol}` });
};

onMounted(() => {
  console.log('symbol-change: onMounted');
});

</script>
