<template>
  <v-container class="d-flex justify-center align-center">
    <v-row>
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        xs="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card @click="goToMovieDetails(movie.id)">
          <v-img :src="movie.image" cover></v-img>
          <v-card-title>
            <strong>
              {{ movie.title }}
            </strong>
          </v-card-title>
          <v-card-subtitle>
            {{ movie.category }}
          </v-card-subtitle>
          <v-card-text> {{ movie.duration }} min </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      movies: [],
      movie: {
        title: "",
        category: "",
        show_time: "",
        duration: "",
        playing_from: "",
        playing_until: "",
        description: "",
        direction: "",
        script: "",
        release_date: "",
        cast: "",
        image: null,
      },
    };
  },
  created() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get("http://localhost:8000/api/movies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const today = new Date().toISOString().slice(0, 10);
        this.movies = response.data.filter(
          (movie) =>
            movie.status === "movie" &&
            movie.playing_from <= today &&
            movie.playing_until >= today
        );
      } catch (error) {
        console.error("Błąd przy pobieraniu danych filmów:", error);
      }
    },
    goToMovieDetails(movieId) {
      this.$router.push({
        path: "/movieDetails",
        query: { movieId },
      });
    },
  },
};
</script>
<style></style>
