<template>
  <h1>Change page</h1>

  <p> Name: {{ userName }} </p>

</template>


<script lang="ts" setup>

const userName = ref('');

const { $listen } = useNuxtApp();

$listen('user:registered', (user) => {
  userName.value = user.name;
});

</script>
