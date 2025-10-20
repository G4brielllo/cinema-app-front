<template>
  <MainSlider />

  <v-parallax :src="paralaxBackground" height="auto">
    <div class="overlay-content">
      <h1 class="blur-behind mt-8">Teraz Gramy</h1>
      <NowPlayingMovies class="transparent-component" />

      <h1 class="blur-behind mt-8"><strong>Zapowiedzi</strong></h1>
      <AnnouncementsForHP class="transparent-component" />
    </div>
  </v-parallax>

  <div class="below-parallax">
    <h1><strong>Promocje</strong></h1>
    <PromotionsPage />
  </div>
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
  border-radius: 8px;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
}

.transparent-component {
  background-color: transparent !important;
}

.below-parallax {
  padding: 3rem 1rem;
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
  background-color: rgba(
    0,
    0,
    0,
    0.25
  ); /* bardzo lekki przyciemniony dla kontrastu */
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: inline-block;
}
</style>
