<template>
  <v-container>
    <v-tabs v-model="tab" bg-color="primary" dark>
      <v-tab value="slides">Slajdy</v-tab>
      <v-tab value="promotions">Promocje</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="slides">
        <v-container>
          <v-btn color="success" @click="openAddSlideModal">Dodaj slajd</v-btn>
          <v-row>
            <v-col v-for="slide in slides" :key="slide.id" cols="12" md="4">
              <v-card>
                <v-img :src="slide.image_url" height="200px" />
                <v-card-title>{{ slide.title }}</v-card-title>
                <v-card-actions>
                  <v-btn color="primary" @click="openEditSlideModal(slide)"
                    >Edytuj</v-btn
                  >
                  <v-btn color="error" @click="deleteSlide(slide.id)"
                    >Usuń</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="promotions">
        <v-container>
          <v-btn color="success" @click="openAddPromotionModal"
            >Dodaj promocję</v-btn
          >
          <v-row>
            <v-col v-for="promo in promotions" :key="promo.id" cols="12" md="4">
              <v-card>
                <v-img :src="promo.image" height="200px" />
                <v-card-title>{{ promo.title }}</v-card-title>
                <v-card-subtitle>{{ promo.description }}</v-card-subtitle>
                <v-card-actions>
                  <v-btn color="primary" @click="openEditPromotionModal(promo)"
                    >Edytuj</v-btn
                  >
                  <v-btn color="error" @click="deletePromotion(promo.id)"
                    >Usuń</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>
    <v-dialog v-model="showSlideModal" max-width="500">
      <v-card>
        <v-card-text>
          <SliderManager
            :mode="modalMode"
            :slide-data="selectedSlide"
            @slide-added="handleSlideAdded"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showPromotionModal" max-width="600">
      <v-card>
        <v-card-text>
          <PromotionsManager
            :mode="promotionModalMode"
            :promotion-data="selectedPromotion"
            @promotion-saved="handlePromotionSaved"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import SliderManager from "./SliderManager.vue";
import PromotionsManager from "./PromotionsManager.vue";

export default {
  components: {
    SliderManager,
    PromotionsManager,
  },
  data() {
    return {
      tab: "slides",
      slides: [],
      promotions: [],
      showSlideModal: false,
      showPromotionModal: false,
      modalMode: "add",
      promotionModalMode: "add",
      selectedSlide: null,
      selectedPromotion: null,
    };
  },
  methods: {
    async fetchSlides() {
      try {
        const res = await axios.get("http://localhost:8000/api/slides/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.slides = res.data;
      } catch (e) {
        console.error("Błąd przy pobieraniu slajdów:", e);
      }
    },
    openAddSlideModal() {
      this.modalMode = "add";
      this.selectedSlide = null;
      this.showSlideModal = true;
    },
    openEditSlideModal(slide) {
      this.modalMode = "edit";
      this.selectedSlide = slide;
      this.showSlideModal = true;
    },
    async deleteSlide(id) {
      try {
        await axios.delete(`http://localhost:8000/api/slides/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.fetchSlides();
      } catch (e) {
        console.error("Błąd przy usuwaniu slajdu:", e);
      }
    },
    handleSlideAdded() {
      this.showSlideModal = false;
      this.fetchSlides();
    },

    // Promotions
    async fetchPromotions() {
      try {
        const res = await axios.get("http://localhost:8000/api/promotions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.promotions = res.data;
      } catch (e) {
        console.error("Błąd przy pobieraniu promocji:", e);
      }
    },
    openAddPromotionModal() {
      this.promotionModalMode = "add";
      this.selectedPromotion = null;
      this.showPromotionModal = true;
    },
    openEditPromotionModal(promotion) {
      this.promotionModalMode = "edit";
      this.selectedPromotion = promotion;
      this.showPromotionModal = true;
    },
    async deletePromotion(id) {
      try {
        await axios.delete(`http://localhost:8000/api/promotions/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.fetchPromotions();
      } catch (e) {
        console.error("Błąd przy usuwaniu promocji:", e);
      }
    },
    handlePromotionSaved() {
      this.showPromotionModal = false;
      this.fetchPromotions();
    },
  },
  created() {
    this.fetchSlides();
    this.fetchPromotions();
  },
};
</script>
