<template>
  <v-container class="d-flex justify-center align-center">
    <v-card width="100%">
      <v-card-title><h1>Slider</h1></v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="slide.title"
            variant="outlined"
            label="Tytuł"
          ></v-text-field>
          <v-text-field
            v-model="slide.trailer_url"
            variant="outlined"
            label="URL (np. trailer)"
          ></v-text-field>
          <v-file-input
            variant="outlined"
            v-model="file"
            accept="image/*"
            @change="createBase64Image"
            label="Zdjęcie"
            required
          ></v-file-input>
        </v-form>
        <div v-if="slide.image_url" class="mt-4">
          <strong>Podgląd:</strong>
          <v-img :src="slide.image_url" max-height="200" contain />
        </div>
        <v-btn @click="saveSlide()">
          {{ mode === "edit" ? "Zapisz zmiany" : "Dodaj Slajd" }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import {
  VContainer,
  VCard,
  VCardText,
  VCardTitle,
  VForm,
  VTextField,
  VFileInput,
  VImg,
  VBtn,
} from "vuetify/lib/components";

export default {
  name: "SliderForm",
  components: {
    VContainer,
    VCard,
    VCardText,
    VCardTitle,
    VForm,
    VTextField,
    VFileInput,
    VImg,
    VBtn,
  },
  props: {
    mode: {
      type: String,
      default: "add",
    },
    slideData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      slide: {
        title: "",
        image_url: "",
        trailer_url: "",
      },
      file: null,
      receivedSlideId: null,
    };
  },
  watch: {
    slideData: {
      handler(val) {
        if (val) {
          this.slide = { ...val };
        }
      },
      immediate: true,
    },
  },
  emits: ["slide-added"],
  methods: {
    async saveSlide() {
      try {
        const url =
          this.mode === "edit"
            ? `http://localhost:8000/api/slides/${this.slide.id}`
            : `http://localhost:8000/api/slides/`;
        const method = this.mode === "edit" ? "put" : "post";
        await axios({
          method,
          url,
          data: this.slide,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.$emit("saved");
      } catch (error) {
        console.error(error.response?.data);
      }
    },
    async addSlide() {
      try {
        const payload = {
          ...this.slide,
        };
        const response = await axios.post(
          "http://localhost:8000/api/slides",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.$emit("slide-added");
        console.log("Slajd dodany:", response.data);
      } catch (error) {
        console.error(
          "Błąd podczas dodawania filmu:",
          error.response?.data || error.message
        );
      }
    },
    createBase64Image(event) {
      const file = event.target?.files?.[0] || this.file;
      if (!file || !(file instanceof Blob)) {
        console.error("Invalid file:", file);
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => console.error("File reading failed");
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => console.error("Image loading failed");
        img.onload = () => {
          const targetWidth = 1600;
          const targetHeight = 540;
          const targetRatio = targetWidth / targetHeight;
          const sourceRatio = img.width / img.height;

          let srcWidth,
            srcHeight,
            srcX = 0,
            srcY = 0;

          if (sourceRatio > targetRatio) {
            srcWidth = img.height * targetRatio;
            srcHeight = img.height;
            srcX = (img.width - srcWidth) / 2;
          } else {
            srcWidth = img.width;
            srcHeight = img.width / targetRatio;
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            img,
            srcX,
            srcY,
            srcWidth,
            srcHeight,
            0,
            0,
            targetWidth,
            targetHeight
          );

          this.slide.image_url = canvas.toDataURL("image/jpeg", 0.9);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>

<style>
v-btn {
  padding: 100px;
}
</style>
