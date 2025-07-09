<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card width="800">
        <v-tabs v-model="tab" bg-color="primary" dark>
          <v-tab value="slider">Slider</v-tab>
          <v-tab value="promotions">Promocje</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="slider">
            <SliderManager />
          </v-window-item>
          <v-window-item value="promotions">
            <PromotionsManager />
          </v-window-item>
        </v-window>
        <v-window v-model="tab">
          <v-window-item value="now-playing-movies">
          </v-window-item>
          <v-window-item value="other">
            <div>Tu możesz dodać inne zarządzanie</div>
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
  </v-app>
</template>
<script>
import SliderManager from './SliderManager.vue';
import PromotionsManager from './PromotionsManager.vue';

export default {
  components: {
    SliderManager,
    PromotionsManager,
  },
  data() {
    return {
      tab: 'slider',
    };
  },
};
</script>
<style></style>
