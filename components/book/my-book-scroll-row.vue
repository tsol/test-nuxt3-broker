

<template>
  <v-row no-gutters>
    <v-col cols="0" sm="2" class="d-none d-sm-block text-no-wrap">
      <v-sheet :color="colors[0]" class="pl-2 pa-1 overflow-x-hidden">
        {{ data[0] }}
      </v-sheet>
    </v-col>

    <v-col cols="3" sm="2" class="text-no-wrap">
      <v-sheet :color="colors[1]" class="pl-2 pa-1 overflow-x-hidden">
        {{ data[1] }}
      </v-sheet>
    </v-col>

    <v-col cols="3" sm="2" class="text-no-wrap">
      <v-sheet :color="colors[2]" class="pl-2 pa-1 overflow-x-hidden">
        {{ data[2] }}
      </v-sheet>
    </v-col>


    <v-col cols="3" sm="2" class="text-no-wrap">
      <v-sheet :color="colors[3]" class="pl-2 pa-1 overflow-x-hidden">
        {{ data[3] }}
      </v-sheet>
    </v-col>

    <v-col cols="3" sm="2" class="text-no-wrap">
      <v-sheet :color="colors[4]" class="pl-2 pa-1 overflow-x-hidden">
        {{ data[4] }}
      </v-sheet>
    </v-col>

    <v-col cols="0" sm="2" class="d-none d-sm-block text-no-wrap">
      <v-sheet :color="colors[5]" class="pl-2 pa-1  overflow-x-hidden">
        {{ data[5] }}
      </v-sheet>
    </v-col>

  </v-row>

</template>

<script lang="ts" setup>

const params = defineProps<{
  colors: string[],
  data: (number | string)[],
}>();


</script>
