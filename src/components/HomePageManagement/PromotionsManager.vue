<template>
  <v-container>
    <v-form>
      <v-text-field v-model="promotion.title" label="Tytuł" outlined required />
      <v-textarea v-model="promotion.description" label="Opis" outlined required />
      <v-file-input
        label="Obrazek"
        accept="image/*"
        v-model="file"
        @change="createBase64Image"
        outlined
        required
      />

      <v-btn @click="savePromotion" color="primary" class="mt-2">
        {{ mode === "edit" ? "Zapisz zmiany" : "Dodaj Promocję" }}
      </v-btn>

      <div v-if="promotion.image" class="mt-4">
        <strong>Podgląd:</strong>
        <v-img :src="promotion.image" max-height="200" contain />
      </div>
    </v-form>
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
