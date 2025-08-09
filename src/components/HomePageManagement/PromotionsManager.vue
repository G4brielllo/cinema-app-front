<template>
  <v-container>
    <v-card width="80%">
      <v-card-title><h1>Dodaj Promocję</h1></v-card-title>
      <v-form>
        <v-text-field
          prepend-icon="mdi-format-title"
          v-model="promotion.title"
          label="Tytuł"
          required
        />
        <v-textarea
          prepend-icon="mdi-text-long"
          v-model="promotion.description"
          label="Opis"
          rows="2"
          variant="underlined"
          auto-grow
          required
        />
        <v-file-input
          label="Obrazek"
          accept="image/*"
          v-model="file"
          @change="createBase64Image"
          required
        />

        <v-btn @click="savePromotion" class="hover-btn mt-4 mb-4 w-100">
          {{ mode === "edit" ? "Zapisz zmiany" : "Dodaj Promocję" }}
        </v-btn>

        <div v-if="promotion.image" class="mt-4">
          <strong>Podgląd:</strong>
          <v-img :src="promotion.image" max-height="200" contain />
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "PromotionsManager",
  props: {
    mode: {
      type: String,
      default: "add",
    },
    promotionData: {
      type: Object,
      default: null,
    },
  },
  emits: ["promotion-saved"],
  data() {
    return {
      promotion: {
        title: "",
        description: "",
        image: "",
      },
      file: null,
    };
  },
  watch: {
    promotionData: {
      handler(val) {
        if (val) this.promotion = { ...val };
      },
      immediate: true,
    },
  },
  methods: {
    createBase64Image(event) {
      const file = event.target?.files?.[0] || this.file;
      if (!file || !(file instanceof Blob)) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.promotion.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async savePromotion() {
      const url =
        this.mode === "edit"
          ? `http://localhost:8000/api/promotions/${this.promotion.id}`
          : `http://localhost:8000/api/promotions`;
      const method = this.mode === "edit" ? "put" : "post";

      try {
        await axios({
          method,
          url,
          data: this.promotion,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        this.$emit("promotion-saved");
      } catch (error) {
        console.error("Błąd przy zapisie promocji:", error.response?.data);
      }
    },
  },
};
</script>
