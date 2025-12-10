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
          <div class="image-wrapper">
            <v-img :src="movie.image" cover class="movie-img" />
          </div>

          <div class="movie-info">
            <h3 class="movie-title">{{ movie.title }}</h3>
            <p class="movie-category">{{ movie.category }}</p>
          </div>
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

<style scoped>
.movie-row-wrapper {
  overflow-x: auto;
  padding: 20px 0;
  -webkit-overflow-scrolling: touch;
}

.movie-row {
  display: flex;
  gap: 20px;
  min-width: max-content;
}

.movie-card {
  width: 220px;
  border-radius: 20px;
  overflow: hidden;
  background: #212121;
  color: white;
  cursor: pointer;
  transition: 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
  z-index: 3;
}

.image-wrapper {
  position: relative;
}

.movie-img {
  height: 320px;
  object-fit: cover;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.movie-info {
  padding: 15px 10px;
  text-align: center;
}

.movie-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 5px;
  white-space: normal;
}

.movie-category {
  font-size: 14px;
  opacity: 0.8;
}
</style>
