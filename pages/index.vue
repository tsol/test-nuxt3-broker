<template>
  <h1>Orders Page</h1>
  <v-btn @click="sendUser('Gosha')">Change</v-btn>
  <p> Name: {{ userName }} </p>
</template>

<script lang="ts" setup>

const userName = ref('');

const { $event, $listen } = useNuxtApp();

const sendUser = (name: string) => {
  $event('user:registered', { name: name });
};

$listen('user:registered', (user) => {
  userName.value = user.name;
});

</script>
