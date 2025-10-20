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
            <v-img max-height="300px" :src="movie.image" aspect-ratio="2/3" elevation="3"></v-img>
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
                <strong>Obsada:</strong> {{ movie.cast }}
              </div>
              <div class="text-grey-darken-1 text-center text-sm-left mt-5">
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
    <v-card>
      <v-card-title class="headline">Zwiastun</v-card-title>
      <v-card-text>
        <iframe
          width="100%"
          height="400"
          :src="currentTrailer"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="trailerDialog = false">Zamknij</v-btn>
      </v-card-actions>
    </v-card>
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
  VCardText,
  VCardActions,
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
    VCardText,
    VCardActions,
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
    openTrailer(movie) {
      if (!movie.trailer) return;

      // Zamień link watch?v= na embed/
      const embedUrl = movie.trailer.replace("watch?v=", "embed/");

      this.currentTrailer = embedUrl;
      this.trailerDialog = true;
    },
  },
};
</script>
<style scoped></style>
