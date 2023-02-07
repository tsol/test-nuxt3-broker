<template>
  <h1>Orders Page</h1>
  <v-btn @click="setSymbol('SOLUSDT')">SET SOLUSDT</v-btn>
  <p> CurrentSymbol: {{ currentSymbol }} </p>
</template>

<script lang="ts" setup>

defineProps<{
  currentSymbol: string
}>();

const { $event } = useNuxtApp();

const setSymbol = (symbol: string) => {
  $event('symbol:changed', { newSymbol: symbol });
}

</script>
