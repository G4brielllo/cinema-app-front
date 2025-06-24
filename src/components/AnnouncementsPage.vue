<template>
  <v-app>
    <v-container class="d-flex align-center justify-center">
      <v-card variant="toned" width="80%">
        <v-card-title>
          <h1 class="mb-10">Zapowiedzi</h1>
        </v-card-title>

        <v-list>
          <v-row
            v-for="movie in movies.filter((m) => m.status === 'announcement')"
            :key="movie.id"
            class="mb-6"
          >
            <v-col cols="3">
              <v-img
                :src="movie.image"
                aspect-ratio="2/3"
                elevation="3"
              ></v-img>
            </v-col>
            <v-col cols="9" class="d-flex flex-column justify-space-between">
              <div>
                <h1>{{ movie.title }}</h1>
                <div class="text-grey-darken-1 text-left mt-5">
                  {{ movie.description }}
                </div>
                <div class="text-grey-darken-1 text-left mt-5">
                  <strong>Obsada:</strong> {{ movie.cast }}
                </div>
                <div class="text-grey-darken-1 text-left mt-5">
                  <strong>
                    {{ movie.category }} | {{ movie.duration }} min
                  </strong>
                </div>
                <v-btn v-if="movie.trailer" class="mt-5" @click="openTrailer(movie)">
                  Zwiastun
                </v-btn>
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
  </v-app>
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
        production_year: "",
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
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      //pobiera movies i screenings
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
<style></style>
