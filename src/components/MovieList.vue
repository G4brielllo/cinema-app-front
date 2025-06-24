<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card>
        <v-card-title>
          <h1>Lista filmów</h1>
        </v-card-title>

        <v-table>
          <thead>
            <tr>
              <th>Zdjęcie</th>
              <th>Tytuł</th>
              <th>Kategoria</th>
              <th>Data rozpoczęcia emisji</th>
              <th>Data zakończenia emisji</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(movie, index) in movies" :key="index">
              <td><img :src="movie.image" alt="Film Image" width="100" /></td>
              <td>{{ movie.title }}</td>
              <td>{{ movie.category }}</td>
              <td>{{ movie.playing_from }}</td>
              <td>{{ movie.playing_until }}</td>
              <td>
                <v-btn @click="editMovie(movie)">Edytuj</v-btn>
                <v-btn @click="deleteMovie(movie.id)">Usuń</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-card-actions>
          <v-btn style="outline: auto" @click="addMovie">Dodaj</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { VApp, VCard, VBtn, VTable } from "vuetify/lib/components";
import axios from "axios";

export default {
  components: {
    VApp,
    VCard,
    VBtn,
    VTable,
  },
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
        production_year: "",
        cast: "",
        image: null,
      },
      file: null,
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
        this.movies = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych filmów:", error);
      }
    },

    editMovie(movie) {
      console.log("Edytowanie filmu:", movie);

      this.$router.push({
        path: "/addMovie",
        query: { movieId: movie.id },
      });
    },

    async deleteMovie(movieId) {
      try {
        await axios.delete(`http://localhost:8000/api/movies/${movieId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.movies = this.movies.filter((movie) => movie.id !== movieId);
        console.log("Usuwanie filmu o id:", movieId);
      } catch (error) {
        console.error("Błąd przy usuwaniu filmu:", error);
      }
    },

    addMovie() {
      console.log("Dodawanie nowego filmu");
    },
  },
};
</script>

<style>
th {
  text-align: center !important;
}
</style>
