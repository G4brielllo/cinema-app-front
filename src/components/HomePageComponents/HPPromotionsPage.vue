<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters class="promotion-banner">
      
      <v-col
        cols="12"
        md="6"
        class="d-flex flex-column justify-center align-start px-8 px-md-16 bg-grey-darken-4 text-section"
      >
        <div style="max-width: 600px; width: 100%">
          <div class="text-overline text-orange-accent-3 font-weight-bold mb-2">
            Oferta Promocyjna
          </div>
          
          <h3 class="text-h4 text-md-h3 font-weight-bold text-white mb-4">
            Złap okazję na <br />
            <span class="text-orange-accent-3">coś pysznego!</span>
          </h3>
          
          <p class="text-body-1 text-grey-lighten-1 mb-8 font-weight-light line-height-relaxed">
            Nie przegap naszych gorących ofert. Idealne zestawy w niższych cenach czekają na Ciebie.
            Sprawdź co przygotowaliśmy w tym tygodniu.
          </p>

          <v-btn
            color="orange-accent-3"
            variant="flat"
            size="x-large"
            class="hover-btn"
            elevation="0"

            @click="goToPromotions"
          >
            Sprawdź ofertę
          </v-btn>
        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="image-section"
      >
        <v-img
          :src="nachos"
          cover
          height="100%"
          width="100%"
          class="brightness-adjust"
        ></v-img>
      </v-col>
      
    </v-row>
  </v-container>
</template>

<script>
import { VContainer, VRow, VCol, VImg, VBtn } from "vuetify/lib/components";
import nachos from "@/assets/nachos.jpg";

export default {
  name: "PromotionBanner",
  components: {
    VContainer,
    VRow,
    VCol,
    VImg,
    VBtn,
  },
  data() {
    return {
      nachos,
    };
  },
  methods: {
    goToPromotions() {
      this.$router.push({ path: "/allPromotionsPage" });
    },
  },
};
</script>

<style scoped>
.promotion-banner {
  min-height: auto; 
}

.text-section {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.image-section {
  min-height: 300px; 
}
@media (min-width: 960px) {
  .promotion-banner {
    height: 550px; 
  }
  
  .text-section {
    padding-top: 0;
    padding-bottom: 0;
  }
  
  .image-section {
    height: 100%;
  }
}

.brightness-adjust {
  filter: brightness(0.9);
}

.line-height-relaxed {
  line-height: 1.6;
}
</style>