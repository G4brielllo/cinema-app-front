<template>
  <v-container class="d-flex align-center justify-center">
    <v-card variant="toned" class="w-100">
      <v-card-title>
        <h1 class="ma-8">Zapowiedzi</h1>
      </v-card-title>

      <v-list>
        <v-row
          v-for="movie in movies.filter((m) => m.status === 'announcement')"
          :key="movie.id"
          class="border-b-md ma-6 pb-4"
        >
          <v-col cols="12" sm="6">
            <v-img
              max-height="300px"
              :src="movie.image"
              aspect-ratio="2/3"
              elevation="3"
            ></v-img>
          </v-col>
          <v-col cols="12" sm="6" class="flex-column justify-space-between">
            <div>
              <div class="text-center text-sm-left">
                <h1>{{ movie.title }}</h1>
              </div>
              <div class="text-grey-darken-1 text-center text-sm-left mt-5">
                {{ movie.description }}
              </div>
              <div class="text-grey-darken-1 text-center text-sm-left mt-5">
                <strong>Data premiery:</strong> {{ formatDate(movie.playing_from) }}
              </div>
              <div class="text-grey-darken-1 text-center text-sm-left mt-5">
                <strong>Obsada:</strong> {{ movie.cast }}
                <div><strong>Kategoria:</strong> {{ movie.category }}</div>
                <div><strong>Czas:</strong> {{ movie.duration }} min</div>
              </div>
              <div class="d-flex justify-center justify-sm-start">
                <v-btn
                  v-if="movie.trailer"
                  class="hover-btn mt-5"
                  @click="openTrailer(movie)"
                >
                  Zwiastun
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-container>
  <v-dialog v-model="trailerDialog" max-width="800px">
    <iframe
      width="100%"
      height="400"
      :src="currentTrailer"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </v-dialog>
</template>

<script>
import {
  VCard,
  VImg,
  VList,
  VRow,
  VCol,
  VBtn,
  VDialog,
  VCardTitle,
} from "vuetify/lib/components";
import "@mdi/font/css/materialdesignicons.css";
import axios from "axios";
export default {
  components: {
    VCard,
    VImg,
    VList,
    VRow,
    VCol,
    VBtn,
    VDialog,
    VCardTitle,
  },
  data() {
    return {
      movies: [],
      movie: {
        title: "",
        category: "",
        show_time: "",
        duration: "",
        release_date: "",
        description: "",
        direction: "",
        script: "",
        cast: "",
        format: "",
        audio_type: "",
        image: null,
        trailer: "",
        status: "",
        playing_from: "",

      },
      trailerDialog: false,
      currentTrailer: "",
    };
  },
  created() {
    this.fetchAnnouncements();
  },
  methods: {
    async fetchAnnouncements() {
      try {
        const response = await axios.get("http://localhost:8000/api/movies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.movies = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych filmów:", error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },
    openTrailer(movie) {
      if (!movie.trailer) return;
      const embedUrl = movie.trailer.replace("watch?v=", "embed/");

      this.currentTrailer = embedUrl;
      this.trailerDialog = true;
    },
  },
};
</script>
<style scoped></style>
