<template>
  <h1>Change symbol</h1>

  <v-select :model-value="currentSymbol" @update:model-value="changeSymbol($event)" label="Select1" :items="symbols"
    variant="solo"></v-select>
  <p> CurrentSymbol: {{ currentSymbol }} </p>

</template>


<script lang="ts" setup>

defineProps<{
  currentSymbol: string
  symbols: string[]
}>();

const { $event, $listen } = useNuxtApp();

$listen('orders-book:diff', (diff) => {
  console.log('symbol-change: diff arrived: ', diff);
});

const changeSymbol = (symbol: string) => {
  $event('symbol:changed', { name: symbol });
};

</script>
