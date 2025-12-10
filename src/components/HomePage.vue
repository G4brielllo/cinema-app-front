<template>
  <MainSlider />
  <v-parallax :src="paralaxBackground" height="auto">
    <div class="overlay-content">
      <h1 class="text-left mt-8">Aktualnie w repertuarze</h1>
      <NowPlayingMovies/>
      <h1 class="text-left mt-8"><strong>Zapowiedzi</strong></h1>
      <AnnouncementsForHP />
      <h1 class="text-left">Promocje</h1>
    </div>
    <div>
      <PromotionsPage />
    </div>
  </v-parallax>
</template>

<script>
import AnnouncementsForHP from "./HomePageComponents/AnnouncementsForHP.vue";
import MainSlider from "./HomePageComponents/MainSlider.vue";
import NowPlayingMovies from "./HomePageComponents/NowPlayingMovies.vue";
import PromotionsPage from "./HomePageComponents/HPPromotionsPage.vue";
import paralaxBackground from "@/assets/background-4.png";

export default {
  components: {
    MainSlider,
    NowPlayingMovies,
    AnnouncementsForHP,
    PromotionsPage,
  },
  data() {
    return {
      paralaxBackground,
    };
  },
};
</script>

<style scoped>
.overlay-content {
  padding: 2rem;
  color: white;
}

h1 {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  margin-bottom: 1.5rem;
}
.blur-behind {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.25);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: inline-block;
}
</style>
