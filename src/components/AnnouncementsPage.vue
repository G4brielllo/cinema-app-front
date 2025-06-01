<template>
  <v-app>
    <v-container class="d-flex align-center justify-center">
      <v-card variant="toned" width="80%">
        <v-card-title>
          <h1 class="mb-10">Zapowiedzi</h1>
        </v-card-title>

        <v-list>
          <v-row
            v-for="movie in movies.filter(m => m.announcement)"
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
                <v-btn class="mt-5">
                  Zwiazstun
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-list>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { VCard } from "vuetify/lib/components";
import "@mdi/font/css/materialdesignicons.css";
import axios from "axios";
export default {
  components: {
    VCard,
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
      },
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
  },
};
</script>
<style></style>
