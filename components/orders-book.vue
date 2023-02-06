<template>
  <h1>Orders Page</h1>
  <v-btn @click="setSymbol('SOLUSDT')">SET SOLUSDT</v-btn>
  <p> CurrentSymbol: {{ props.currentSymbol }} </p>
</template>

<script lang="ts" setup>
import { SelectedSymbol } from '~~/plugins/event-bus';

const props = defineProps(['currentSymbol'])

const { $event, $listen } = useNuxtApp();

const setSymbol = (symbol: SelectedSymbol['name']) => {
  $event('symbol:changed', { name: symbol });
}

</script>
