<template>
  <div class="promotions-wrapper">
    <div
      v-for="promotion in promotions"
      :key="promotion.id"
      class="promo-section-container"
    >
      <v-container fluid class="pa-0">
        <v-row no-gutters class="promo-row align-center">
          <v-col
            cols="12"
            md="6"
            class="content-col d-flex flex-column justify-center position-relative fill-height"
          >
            <div class="content-wrapper px-8 px-md-16 py-8">
              <div class="title-block mb-4">
                <h2 class="text-h4 text-left font-weight-bold text-white lh-tight">
                  {{ promotion.title }}
                </h2>
              </div>

              <h4
                class="text-left text-subtitle-1  text-grey-lighten-1 mb-6 pre-line description-text"
              >
                {{ promotion.description }}
            </h4>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="image-col overflow-hidden fill-height">
            <div class="img-zoom-wrapper fill-height">
              <v-img
                :src="promotion.image"
                cover
                height="100%"
                width="100%"
                class="promo-image"
              >
                <template v-slot:placeholder>
                  <div
                    class="d-flex align-center justify-center fill-height bg-grey-darken-4"
                  >
                    <v-progress-circular
                      indeterminate
                      color="orange-accent-3"
                    ></v-progress-circular>
                  </div>
                </template>

                <div class="image-gradient-overlay"></div>
              </v-img>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  VContainer,
  VRow,
  VCol,
  VImg,
  VProgressCircular,
} from "vuetify/lib/components";

export default {
  name: "PromotionsManager",
  components: {
    VContainer,
    VRow,
    VCol,
    VImg,
    VProgressCircular,
  },
  data() {
    return {
      promotions: [],
    };
  },
  created() {
    this.fetchPromotions();
  },
  methods: {
    async fetchPromotions() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/promotions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.promotions = response.data;
      } catch (error) {
        console.error("Błąd:", error);
      }
    },
  },
};
</script>

<style scoped>
.promo-section-container {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.promo-row {
  height: 420px;
  overflow: hidden;
}

.content-col {
  background-color: #0a0a0a;
  z-index: 1;
}

.title-block {
  border-left: 4px solid #ff9100;
  padding-left: 20px;
}

.lh-tight {
  line-height: 1.2 !important;
}

.letter-spacing-2 {
  letter-spacing: 2px !important;
}

.description-text {
  line-height: 1.6;
  opacity: 0.9;
  max-width: 580px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.image-col {
  position: relative;
  height: 100%;
}

.img-zoom-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.promo-image {
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: brightness(0.9);
}

.image-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10, 10, 10, 1) 0%,
    rgba(10, 10, 10, 0) 20%
  );
  z-index: 2;
  pointer-events: none;
}
.promo-row:hover .promo-image {
  transform: scale(1.06);
  filter: brightness(1);
}

.promo-row:hover .title-block {
  border-left-color: #fff;
  transition: border-color 0.3s ease;
}

.action-btn {
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: 0.5px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 145, 0, 0.4);
  background-color: #fff !important;
}

@media (max-width: 960px) {
  .promo-row {
    height: auto;
    min-height: auto;
    flex-direction: column;
  }

  .content-col {
    order: 2;
    padding-bottom: 40px !important;
  }

  .image-col {
    height: 240px;
    order: 1;
  }

  .image-gradient-overlay {
    background: linear-gradient(
      0deg,
      rgba(10, 10, 10, 1) 0%,
      rgba(10, 10, 10, 0) 30%
    );
  }
}
</style>
