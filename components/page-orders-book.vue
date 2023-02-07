<template>
  <h1>Orders Book Page</h1>
  <v-btn @click="setSymbol('SOLUSDT')">SET SOLUSDT</v-btn>
  <p> CurrentSymbol: {{ currentSymbol }} </p>

  <p>Loading state: {{ book.loadingState }} </p>

  <p>Asks: {{ book.asks }} </p>
  <p>Bids: {{ book.bids }} </p>

</template>

<script lang="ts" setup>

const { $busEmit } = useNuxtApp();

const props = defineProps<{
  currentSymbol: string
}>();

const book = useBook();

const setSymbol = (symbol: string) => {
  $busEmit('symbol:changed', { newSymbol: symbol });
}

onMounted(() => {
  console.log('orders-book: onMounted');
});

</script>
