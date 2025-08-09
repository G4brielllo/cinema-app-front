<template>
  <v-container fluid class="promotion-hero d-flex align-center">
    <v-row no-gutters class="fill-height">
      <v-col
        cols="12"
        md="6"
        class="text-col d-flex flex-column justify-center px-12"
      >
        <div class="flex-column d-flex justify-center align-center text-white">
          <h2 class="text-h2 font-weight-medium mb-4">Oferta promocyjna</h2>
          <h5 class="text-h5 font-weight-medium mb-4">
            Sprawdź dostępne promocje i zaskocz się świetnymi ofertami!
          </h5>
          <v-btn
            variant="outlined"
            class="hover-btn mb-4"
            @click="goToPromotions"
          >
            Sprawdź
          </v-btn>
        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="image-col d-flex align-center justify-center"
      >
        <v-img
          :src="nachos"
          height="100%"
          width="100%"
          cover
          class="rounded-img"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VContainer, VRow, VCol, VImg, VBtn } from "vuetify/lib/components";
import nachos from "@/assets/nachos.jpg";
export default {
  data() {
    return {
      nachos,
    };
  },
  components: {
    VContainer,
    VRow,
    VCol,
    VImg,
    VBtn,
  },
  name: "PromotionHero",
  methods: {
    goToPromotions() {
      this.$router.push({ path: "/allPromotionsPage" });
    },
  },
};
</script>

<style scoped>
.promotion-hero {
  background-color: black;
  height: 100vh;
  overflow: hidden;
}

.text-button {
  letter-spacing: 3px;
  border-radius: 4px;
}

.image-col {
  background: radial-gradient(
    circle at center,
    rgba(255, 0, 255, 0.3),
    transparent 70%
  );
}
.rounded-img {
  border-radius: 16px;
  object-fit: cover;
}
</style>
