<template>
  <v-container class="d-flex justify-center align-center">
    <v-card width="50%">
      <h1 class="text-center">Zarządzanie Promocjami</h1>
      <v-row>
        <v-col>
          <v-card-title>Dodaj nową promocję</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Tytuł"
                v-model="promotion.title"
                required
              ></v-text-field>

              <v-textarea
                label="Opis"
                v-model="promotion.description"
                required
              ></v-textarea>

              <v-file-input
                label="Obrazek"
                accept="image/*"
                @change="createBase64Image"
                required
              ></v-file-input>

              <v-btn @click="addPromotion" color="primary">
                Dodaj Promocję
              </v-btn>

              <div v-if="previewImage" class="mt-4">
                <strong>Podgląd:</strong>
                <v-img :src="previewImage" max-height="200" contain />
              </div>
            </v-form>
          </v-card-text>
        </v-col>

        <v-col
          v-for="promotion in promotions"
          :key="promotion.id"
          cols="12"
          md="6"
        >
          <v-card>
            <v-img :src="promotion.image" height="200px"></v-img>
            <v-card-title>{{ promotion.title }}</v-card-title>
            <v-card-subtitle>{{ promotion.description }}</v-card-subtitle>
            <v-card-actions>
              <v-btn @click="editPromotion(promotion.id)" color="primary">Edytuj</v-btn>
              <v-btn @click="deletePromotion(promotion.id)" color="error">Usuń</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import {
  VCard,
  VImg,
  VContainer,
  VTextField,
  VRow,
  VCol,
  VBtn,
  VCardTitle,
  VCardText,
  VCardActions,
} from "vuetify/lib/components";
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
  components: {
    VContainer,
    VCard,
    VRow,
    VCol,
    VCardTitle,
    VCardText,
    VTextField,
    VBtn,
    VImg,
    VCardActions,
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
    async deletePromotion(promotionId) {
      try {
        await axios.delete(`http://localhost:8000/api/promotions/${promotionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.promotions = this.promotions.filter(p => p.id !== promotionId);
        console.log("Promocja usunięta:", promotionId);
      } catch (error) {
        console.error("Błąd podczas usuwania promocji:", error);
      }
    },

  },
};
</script>

<style scoped>
.v-card {
  padding: 16px;
}
</style>
