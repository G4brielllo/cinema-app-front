<template>
  <MainSlider />
  <h1><strong>Teraz Gramy</strong></h1>
  <NowPlayingMovies />
  <h1><strong>Zapowiedzi</strong></h1>
  <AnnouncementsForHP />
  <h1><strong>Promocje</strong></h1>
  <PromotionsPage />
  
  <!-- <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
  </v-parallax> -->
</template>
<script>
import AnnouncementsForHP from "./HomePageComponents/AnnouncementsForHP.vue";
import MainSlider from "./HomePageComponents/MainSlider.vue";
import NowPlayingMovies from "./HomePageComponents/NowPlayingMovies.vue";
import PromotionsPage from "./HomePageComponents/PromotionsPage.vue";
export default {
  components: {
    MainSlider,
    NowPlayingMovies,
    AnnouncementsForHP,
    PromotionsPage,
  },
};
</script>
<style></style>
