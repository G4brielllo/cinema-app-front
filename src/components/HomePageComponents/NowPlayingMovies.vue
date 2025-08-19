<template>
  <v-container class="d-flex justify-center">
    <div class="movie-row-wrapper">
      <div class="movie-row">
        <v-card
          v-for="movie in movies"
          :key="movie.id"
          class="movie-card"
          @click="goToMovieDetails(movie.id)"
        >
          <v-img :src="movie.image" cover></v-img>
          <v-card-title style="white-space: normal; word-break: break-word">
            <strong>{{ movie.title }}</strong>
          </v-card-title>
          <v-card-subtitle
            ><strong>{{ movie.category }}</strong></v-card-subtitle
          >
          <v-card-text>{{ movie.duration }} min</v-card-text>
        </v-card>
      </div>
    </div>
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

<style>
.movie-row-wrapper {
  overflow-x: auto;
  padding: 20px 0;
  -webkit-overflow-scrolling: touch;
  margin: 0 -5%;
}

.movie-row {
  display: flex;
  gap: 15px;
  min-width: max-content;
  padding: 0 5%;
}

.movie-card {
  min-width: 220px;
  flex: 0 0 auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  z-index: 2;
}

.v-img {
  height: 350px;
  object-fit: cover;
}

.v-container {
  max-width: 100% !important;
  padding: 0 !important;
}
</style>
