<template>
  <v-container class="d-flex flex-column align-center">
    <v-card class="w-100 mb-6">
      <v-card-title class="d-flex justify-space-between align-center">
        <h1>Lista filmów</h1>
        <v-btn class="hover-btn" style="max-width: 70px" @click="goToAddMovie">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-table>
        <thead>
          <tr>
            <th>Zdjęcie</th>
            <th>Tytuł</th>
            <th>Kategoria</th>
            <th>Data rozpoczęcia emisji</th>
            <th>Data zakończenia emisji</th>
            <th>Status</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="movie in movies.filter((m) => m.status === 'movie')"
            :key="movie.id"
          >
            <td><img :src="movie.image" alt="Film Image" width="100" /></td>
            <td>{{ movie.title }}</td>
            <td>{{ movie.category }}</td>
            <td>{{ movie.playing_from }}</td>
            <td>{{ movie.playing_until }}</td>
            <td>{{ movie.status }}</td>
            <td>
              <v-btn class="ma-1 hover-btn" @click="editMovie(movie)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="ma-1 hover-btn"
                @click="confirmDeleteMovie(movie.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-card class="w-100 mb-6">
      <v-card-title class="d-flex justify-space-between align-center">
        <h1>Zapowiedzi</h1>
        <v-btn
          class="hover-btn"
          style="max-width: 70px"
          @click="goToAddAnnouncement"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-table>
        <thead>
          <tr>
            <th>Zdjęcie</th>
            <th>Tytuł</th>
            <th>Kategoria</th>
            <th>Data rozpoczęcia emisji</th>
            <th>Data zakończenia emisji</th>
            <th>Status</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="movie in movies.filter((m) => m.status === 'announcement')"
            :key="movie.id"
          >
            <td><img :src="movie.image" alt="Film Image" width="100" /></td>
            <td>{{ movie.title }}</td>
            <td>{{ movie.category }}</td>
            <td>{{ movie.playing_from }}</td>
            <td>{{ movie.playing_until }}</td>
            <td>{{ movie.status }}</td>
            <td>
              <v-btn class="ma-1 hover-btn" @click="editMovie(movie)"
                ><v-icon> mdi-pencil </v-icon></v-btn
              >
              <v-btn
                class="ma-1 hover-btn"
                @click="confirmDeleteMovie(movie.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script>
import { VCard, VBtn, VTable } from "vuetify/lib/components";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: {
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
        release_date: "",
        cast: "",
        image: null,
        status: "",
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
        // this.movies = response.data.filter(
        //   (movie) => movie.status === "movie"
        // );
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
        console.log("Usunięto film o id:", movieId);
      } catch (error) {
        console.error("Błąd przy usuwaniu filmu:", error);
        Swal.fire({
          icon: "error",
          title: "Błąd",
          text: "Nie udało się usunąć filmu.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    },

    goToAddMovie() {
      this.$router.push("/addMovie");
    },
    goToAddAnnouncement() {
      this.$router.push("/addMovie");
    },
    confirmDeleteMovie(movieId) {
      Swal.fire({
        icon: "info",
        title: "Akcja wymaga potwierdzenia",
        text: "Czy na pewno chcesz usunąć film?",
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Usuń",
        denyButtonText: `Anuluj`,
        confirmButtonColor: "red",
        denyButtonColor: "lightblue",
        animation: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.deleteMovie(movieId);
          Swal.fire({
            icon: "success",
            title: "Film usunięty",
            text: "Film został pomyślnie usunięty.",
            animation: true,
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else if (result.isDenied) {
          Swal.fire({
            icon: "info",
            title: "Anulowano",
            text: "Usuwanie filmu zostało anulowane.",
            animation: true,
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      });
    },
  },
};
</script>

<style>
th {
  text-align: center !important;
}
</style>
