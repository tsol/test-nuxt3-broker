<template>
  <v-card>
    <v-layout>

      <v-app-bar color="primary" class="w-100" density="compact">
        <template v-slot:prepend>
          <v-btn @click.stop="menuClick()" icon="mdi-menu" />
          <!--<v-app-bar-nav-icon></v-app-bar-nav-icon>-->
        </template>

        <v-app-bar-title>Nuxt3-TS-Broker</v-app-bar-title>

        <template v-slot:append>
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>

      </v-app-bar>


      <Teleport to="body">
        <v-navigation-drawer v-model="drawer" temporary>
          <v-list-item prepend-avatar="/avatars/cartoon-harry.jpeg" title="Igor Kravets"></v-list-item>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item @click.stop="navigateTo('/')" prepend-icon="mdi-view-dashboard" title="Live Orders"
              value="orders">
            </v-list-item>
            <v-list-item @click.stop="navigateTo('/change')" prepend-icon="mdi-bitcoin" title="Change Symbol"
              value="change">
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </Teleport>


      <v-main>
        <slot />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

let drawer = ref(false);

const menuClick = () => {
  console.log("menuClick", drawer.value);
  drawer.value = !drawer.value;
};
</script>
