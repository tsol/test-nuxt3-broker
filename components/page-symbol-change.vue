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

const { $busOn, $busEmit } = useNuxtApp();

// $busOn('orders-book:diff', (event) => {
//   console.log('symbol-change-page: diff arrived: ', event);
// });


const changeSymbol = (symbol: string) => {
  $busEmit('symbol:changed', { newSymbol: symbol });
};

onMounted(() => {
  console.log('symbol-change: onMounted');
});


</script>
