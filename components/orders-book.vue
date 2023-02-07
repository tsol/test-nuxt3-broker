<template>
  <h1>Orders Page</h1>
  <v-btn @click="setSymbol('SOLUSDT')">SET SOLUSDT</v-btn>
  <p> CurrentSymbol: {{ currentSymbol }} </p>
  <div>Connected: {{ connected }}</div>
</template>

<script lang="ts" setup>
import { io } from 'socket.io-client';

const connected = ref(false);

defineProps<{
  currentSymbol: string
}>();

const { $event } = useNuxtApp();

const setSymbol = (symbol: string) => {
  $event('symbol:changed', { newSymbol: symbol });
}


onMounted(() => {


  fetch("/api/initServer", {
    method: "GET"
  }).then(res => res.json()).then(data => {
    console.log("Server returned: ", data)

    const socket = io(':3005');
    console.log(socket);

    socket.on('connect', () => {
      console.log('connected to websocket server');
      connected.value = true;
    });

    socket.on('disconnect', () => {
      console.log('disconnected to websocket server');
      connected.value = false;
    });

    socket.on('message', (message) => {
      console.log('message: ', message);
    });


  })

});

</script>
