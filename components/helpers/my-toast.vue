
<template>
  <v-snackbar location="top right" v-model="snackbar" :timeout="timeout">
    {{ text }}

    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>

  </v-snackbar>
</template>

<script lang="ts" setup>

const text = ref('');
const snackbar = ref(false);
const timeout = ref(2000);

const { $busOn } = useNuxtApp();

$busOn('toast:error', (event: { message: string }) => {
  text.value = event.message;
  snackbar.value = true;
});

$busOn('toast:message', (event: { message: string }) => {
  text.value = event.message;
  snackbar.value = true;
});

</script>
