<template>
  <div>
    <div v-if="book.loadingState !== 'no'" class="text-center mt-13">
      <v-progress-circular color="blue-lighten-3" indeterminate :size="101" :width="10"></v-progress-circular>
    </div>
    <v-card v-else class="mt-10 mb-10 mx-auto" elevation="5" max-width="1024" min-width="360">


      <v-card-title class="white--text orange darken-4">
        <MyBookScrollRow :data="['Total', 'Qty', 'Price', 'Price', 'Qty', 'Total']"
          :colors="['white', 'white', 'white', 'white', 'white', 'white']">
        </MyBookScrollRow>
      </v-card-title>

      <v-divider></v-divider>

      <v-virtual-scroll :items="bookRows" height="calc(80vh - 48px)">
        <template v-slot:default="{ item }">
          <MyBookScrollRow :data="flatten(item)"
            :colors="['white', 'white', 'green-lighten-4', 'red-lighten-4', 'white', 'white']">
          </MyBookScrollRow>
        </template>
      </v-virtual-scroll>

    </v-card>
  </div>
</template>

<script lang="ts" setup>
//import { VVirtualScroll } from 'vuetify/labs/VVirtualScroll'

const book = useBook();

const fnum = (num: number, digits: number): number => {
  var pow = Math.pow(10, digits);
  return Math.round(num * pow) / pow;
}

const to2d = (map: Map<string, string>) => {
  const res: [number, number, number][] = Array.from(map, ([key, value]) => {
    const [price, qty] = [Number(key), Number(value)];
    const total = fnum(price * qty, 2);
    return [price, qty, total];
  });
  return res;
};


const flatten = (bookRow: number[][]): number[] => {
  return [
    bookRow[0][2],
    bookRow[0][1],
    bookRow[0][0],
    bookRow[1][0],
    bookRow[1][1],
    bookRow[1][2]
  ];
}

const bookRows = computed(() => {
  const bids = to2d(book.value.bids).sort((a, b) => b[0] - a[0]);
  const asks = to2d(book.value.asks).sort((a, b) => a[0] - b[0]);
  //.filter((a) => a[0] > bids[0][0]);

  const max = Math.max(asks.length, bids.length);
  let ia = 0, ib = 0;
  const res = [];
  for (let i = 0; i < max; i++) {
    const ask = i < asks.length ? asks[ia++] : [0, 0, 0];
    const bid = i < bids.length ? bids[ib++] : [0, 0, 0];
    res.push([bid, ask]);
  }
  return res;
});


</script>

<style scoped>

</style>
