<template>
  <v-card
    class="promotion-hero"
    height="500px"
    rounded="0"
    v-for="promotion in promotions"
    :key="promotion.id"
  >
    <v-container fluid class="d-flex align-center">
      <v-row no-gutters class="fill-height">
        <v-col cols="12" md="6" class="text-zone justify-center px-8">
          <div class="centered-column text-white">
            <h2 class="text-h4 font-weight-bold">{{ promotion.title }}</h2>
            <p class="text-subtitle-1 pre-line">{{ promotion.description }}</p>
          </div>
        </v-col>
        <v-col>
          <v-img class="img-style" :src="promotion.image"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import axios from "axios";

export default {
  name: "PromotionsManager",
  data() {
    return {
      promotions: [],
      promotion: {
        title: "",
        description: "",
        image: "",
      },
      previewImage: null,
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
        console.error("Błąd przy pobieraniu promocji:", error);
      }
    },
    createBase64Image(event) {
      const file = event.target.files[0];
      if (!(file instanceof Blob)) {
        console.error("Niepoprawny typ pliku:", file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.promotion.image = e.target.result; // <-- base64
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async addPromotion() {
      try {
        const payload = {
          title: this.promotion.title,
          description: this.promotion.description,
          image: this.promotion.image, // base64 string
        };

        const response = await axios.post(
          "http://localhost:8000/api/promotions",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json", // ważne!
            },
          }
        );

        console.log("Promocja dodana:", response.data);
        this.promotions.push(response.data);
      } catch (error) {
        console.error(
          "Błąd podczas dodawania promocji:",
          error.response?.data || error.message
        );
      }
    },
  },
};
</script>
<style>
.promotion-hero {
  background-color: black;
  height: 100vh;
  overflow: hidden;
}
.centered-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 400px;
}
.img-style {
  border-radius: 5%;
}
.pre-line {
  white-space: pre-line;
}
</style>
