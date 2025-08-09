<template>
  <v-container>
    <v-card width="80%" variant="flat">
      <v-tabs align-tabs="center" v-model="tab" bg-color="secondary" dark>
        <v-tab value="slides">Slajdy</v-tab>
        <v-tab value="promotions">Promocje</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="slides">
          <v-container>
            <v-row>
              <v-col v-for="slide in slides" :key="slide.id" cols="12" md="4">
                <v-card>
                  <v-img :src="slide.image_url" height="200px" />
                  <v-card-title>{{ slide.title }}</v-card-title>
                  <v-card-actions>
                    <v-btn class="hover-btn" @click="openEditSlideModal(slide)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn class="hover-btn" @click="deleteSlide(slide.id)">
                      <v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col>
                <v-card
                  @click="openAddSlideModal"
                  class="d-flex flex-column align-center justify-center fill-height"
                >
                  <v-icon size="48">mdi-plus</v-icon>
                  <v-card-title>Dodaj nowy slajd</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>

        <v-window-item value="promotions">
          <v-container>
            <v-row>
              <v-col
              v-for="promo in promotions"
              :key="promo.id"
              cols="12"
              md="4"
              >
              <v-card>
                <v-img :src="promo.image" height="200px" />
                <v-card-title>{{ promo.title }}</v-card-title>
                <v-card-subtitle>{{ promo.description }}</v-card-subtitle>
                <v-card-actions>
                  <v-btn
                  class="hover-btn"
                  @click="openEditPromotionModal(promo)"
                  >
                  <v-icon>mdi-pencil</v-icon></v-btn
                  >
                  <v-btn class="hover-btn" @click="deletePromotion(promo.id)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
             <v-col>
                <v-card
                  @click="openAddPromotionModal"
                  class="d-flex flex-column align-center justify-center fill-height"
                >
                  <v-icon size="48">mdi-plus</v-icon>
                  <v-card-title>Dodaj nową promocję</v-card-title>
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
    </v-card>
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
