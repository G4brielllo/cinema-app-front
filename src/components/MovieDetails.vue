<template>
  <v-container>
    <v-card variant="flat">
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-img :src="movie.image"></v-img>
        </v-col>
        <v-col>
          <v-card-title>
            <h1>{{ movie.title }}</h1>
          </v-card-title>

          <v-card-subtitle>
            <strong>{{ movie.category }}</strong> | {{ movie.duration }} min
          </v-card-subtitle>
          <v-card-text>
            <p>{{ movie.description }}</p>
          </v-card-text>
          <v-card-text>
            <v-row dense>
              <v-col cols="3" class="font-weight-bold">Data premiery:</v-col>
              <v-col cols="9">{{ movie.release_date }}</v-col>

              <v-col cols="3" class="font-weight-bold">Reżyseria:</v-col>
              <v-col cols="9">{{ movie.direction }}</v-col>

              <v-col cols="3" class="font-weight-bold">Obsada:</v-col>
              <v-col cols="9">{{ movie.cast }}</v-col>
            </v-row>
          </v-card-text>
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
      movie: {
        title: "",
        category: "",
        show_time: "",
        duration: "",
        release_date: "",
        description: "",
        direction: "",
        script: "",
        image: "",
        format: "",
        audio_type: "",
      },
    };
  },
  created() {
    this.fetchMovieData();
  },
  methods: {
    async fetchMovieData() {
      try {
        const movieId = this.$route.query.movieId;
        const response = await axios.get(
          `http://localhost:8000/api/movies/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.movie = response.data;
        console.log(response.data);
      } catch (error) {
        console.error("Błąd przy pobieraniu danych seansu:", error);
      }
    },
  },
};
</script>
<style>
.v-card-title,
.v-card-subtitle,
.v-card-text {
  text-align: left;
}
</style>
