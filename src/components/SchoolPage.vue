<template>
  <v-container class="d-flex align-center justify-center">
    <v-card class="pa-8 w-100" variant="tonned">
      <v-card-title>
        <h1 class="text-left mb-8">CineManager dla szkół</h1>
      </v-card-title>

      <v-slide-group
        v-model="active"
        show-arrows
        center-active
        class="coverflow-group"
      >
        <v-slide-group-item
          v-for="(movie, i) in filteredMovies"
          :key="movie.id"
        >
          <v-card
            rounded="xl"
            class="movie-card"
            :class="{ active: active === i }"
            @click="
              goToMovieDetails(movie.id);
              active = i;
            "
          >
            <v-img :src="movie.image" height="400" cover />
          </v-card>
        </v-slide-group-item>
      </v-slide-group>

      <v-row justify="center" align="stretch" dense>
        <v-col cols="12" sm="6" md="4">
          <v-card
            outlined
            class="pa-6 text-center d-flex flex-column align-center h-100"
          >
            <v-icon size="48" color="primary">mdi-account-group</v-icon>
            <h3 class="mt-3">Opiekunowie wchodzą za darmo</h3>
            <p>Każdy opiekun ma darmowe wejście na seans szkolny.</p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card
            outlined
            class="pa-6 text-center d-flex flex-column align-center h-100"
          >
            <v-icon size="48" color="primary">mdi-calendar-check</v-icon>
            <h3 class="mt-3">Rezerwacje</h3>
            <p>Rezerwuj seanse telefonicznie lub mailowo.</p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card
            outlined
            class="pa-6 text-center d-flex flex-column align-center h-100"
          >
            <v-icon size="48" color="primary">mdi-phone</v-icon>
            <h3 class="mt-3">Kontakt</h3>
            <p>
              Zadzwoń: <a href="tel:+48123456789">+48 123 456 789</a><br />
              Napisz:
              <a href="mailto:szkola@cinemanager.pl">szkola@cinemanager.pl</a>
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      movies: [],
      dialog: false,
      selectedMovie: null,
      active: 0,
    };
  },
  computed: {
    filteredMovies() {
      return this.movies.filter(
        (movie) =>
          movie.status === "movie" &&
          (movie.age_group === "Dzieci" || movie.age_group === "Młodzież")
      );
    },
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get("http://localhost:8000/api/movies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        this.movies = response.data.map((movie) => {
          if (
            movie.image &&
            !movie.image.startsWith("data:image/jpeg") &&
            !movie.image.startsWith("data:image/png")
          ) {
            movie.image = `${movie.image}`;
          }
          return movie;
        });
      } catch (error) {
        console.error("Błąd pobierania filmów:", error);
      }
    },

    goToMovieDetails(movieId) {
      this.$router.push({
        path: "/movieDetails",
        query: { movieId },
      });
    },
  },
  created() {
    this.fetchMovies();
  },
};
</script>

<style scoped>
.coverflow-group {
  overflow: visible;
  padding-bottom: 40px;
}

.movie-card {
  min-width: 270px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: scale(0.85);
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  z-index: 2;
}

::v-deep(.v-slide-group__content) {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
