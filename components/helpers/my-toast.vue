
<template>
  <v-snackbar :color="toastColor" location="top right" v-model="snackbar" :timeout="timeout">
    {{ text }}

    <!--
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  -->

  </v-snackbar>
</template>

<script lang="ts" setup>

const text = ref('');
const isError = ref(false);
const snackbar = ref(false);
const timeout = ref(2000);

const { $busOn } = useNuxtApp();

$busOn('toast:error', (event: { message: string }) => {
  text.value = event.message;
  snackbar.value = true;
  isError.value = true;
});

$busOn('toast:message', (event: { message: string }) => {
  text.value = event.message;
  snackbar.value = true;
  isError.value = false;
});

const toastColor = computed(() => {
  return isError.value ? 'red accent-2' : 'deep-gray accent-4'
});

</script>
