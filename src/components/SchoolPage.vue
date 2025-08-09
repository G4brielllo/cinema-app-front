<template>
  <v-container class="d-flex align-center justify-center">
    <v-card class="pa-8 h-100" variant="tonned">
      <h1 class="text-center mb-8">CineManager dla szkół</h1>
      <v-carousel
        v-if="filteredMovies.length"
        cycle
        interval="6000"
        height="400"
        show-arrows-on-hover
        hide-delimiter-background
         class="coverflow-carousel"
      >
        <v-carousel-item
          v-for="movie in filteredMovies"
          :key="movie.id"
          class="carousel-item"
        >
          <v-img :src="movie.image" rounded="xl" cover class="carousel-img">
            <div class="overlay">
              <h2>{{ movie.title }}</h2>
              <p>{{ movie.category }} | {{ movie.duration }} min</p>
              <v-btn class="hover-btn" @click="openDialog(movie)">
                Szczegóły
              </v-btn>
            </div>
          </v-img>
        </v-carousel-item>
      </v-carousel>

      <v-row class="mt-10" justify="center" align="stretch" dense>
        <v-col cols="12" sm="6" md="4">
          <v-card outlined class="pa-6 text-center">
            <v-icon size="48" color="primary">mdi-account-group</v-icon>
            <h3 class="mt-3">Opiekunowie wchodzą za darmo</h3>
            <p>Każdy opiekun ma darmowe wejście na seans szkolny.</p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card outlined class="pa-6 text-center">
            <v-icon size="48" color="primary">mdi-calendar-check</v-icon>
            <h3 class="mt-3">Rezerwacje</h3>
            <p>Rezerwuj seanse telefonicznie lub mailowo.</p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card outlined class="pa-6 text-center">
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

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-img :src="selectedMovie?.image" height="220" cover />
          <v-card-title>{{ selectedMovie?.title }}</v-card-title>
          <v-card-text>
            <p><strong>Kategoria:</strong> {{ selectedMovie?.category }}</p>
            <p>
              <strong>Czas trwania:</strong> {{ selectedMovie?.duration }} min
            </p>
            <p><strong>Opis:</strong> {{ selectedMovie?.description }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="dialog = false">Zamknij</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    openDialog(movie) {
      this.selectedMovie = movie;
      this.dialog = true;
    },
  },
  created() {
    this.fetchMovies();
  },
};
</script>

<style scoped>
.carousel-img {
  position: relative;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 20px 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.overlay h2 {
  margin-bottom: 8px;
  font-size: 24px;
}

.overlay p {
  margin-bottom: 12px;
  font-size: 16px;
}
.v-card {
  height: 200px;
}

</style>
