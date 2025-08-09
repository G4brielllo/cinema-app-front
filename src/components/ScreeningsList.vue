<template>
  <v-container>
    <v-card class="w-100">
      <v-card-title class="d-flex justify-space-between align-center">
        <h1>Lista Seansów</h1>
        <v-btn
          class="hover-btn"
          style="max-width: 70px"
          @click="goToAddScreening"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-table>
        <thead>
          <tr>
            <th>Zdjęcie</th>
            <th>Nazwa</th>
            <th>Data</th>
            <th>Godzina</th>
            <th>Status</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(screening, index) in sortedScreenings" :key="index">
            <td>
              <img
                :src="screening.movie.image"
                alt="Screening Image"
                width="100"
              />
            </td>
            <td>{{ screening.movie.title }}</td>
            <td>{{ screening.screening_date }}</td>
            <td>{{ screening.screening_time }}</td>
            <td>{{ screening.status }}</td>
            <td>
              <v-btn class="ma-1 hover-btn" @click="editScreening(screening)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="ma-1 hover-btn"
                @click="confirmDeleteScreening(screening.id)"
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
        release_date: "",
        description: "",
        direction: "",
        script: "",
        cast: "",
        image: null,
      },
      screenings: [],
      screening: {
        movie_id: null,
        status: "",
        screening_date: "",
        screening_time: "",
      },
      file: null,
    };
  },
  created() {
    this.fetchScreenings();
  },
  computed: {
    sortedScreenings() {
      return this.screenings.slice().sort((a, b) => {
        if (a.status === b.status) {
          return new Date(b.screening_date) - new Date(a.screening_date);
        }
        return a.status === "active" ? -1 : 1;
      });
    },
  },
  methods: {
    async fetchScreenings() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/screenings",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.screenings = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych seansu:", error);
      }
    },

    editScreening(screening) {
      console.log("Edytowanie seansu:", screening);

      this.$router.push({
        path: "/addMovieScreening",
        query: { screeningId: screening.id },
      });
    },

    async deleteScreening(screeningId) {
      try {
        await axios.delete(
          `http://localhost:8000/api/screenings/${screeningId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.screenings = this.screenings.filter(
          (screening) => screening.id !== screeningId
        );
        console.log("Usuwanie seansu o id:", screeningId);
      } catch (error) {
        console.error("Błąd przy usuwaniu seansu:", error);
      }
    },
    goToAddScreening() {
      this.$router.push("/addMovieScreening");
    },
    confirmDeleteScreening(screeningId) {
      Swal.fire({
        icon: "info",
        title: "Akcja wymaga potwierdzenia",
        text: "Czy na pewno chcesz usunąć seans?",
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Usuń",
        denyButtonText: `Anuluj`,
        confirmButtonColor: "red",
        denyButtonColor: "lightblue",
        animation: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.deleteScreening(screeningId);
          Swal.fire({
            icon: "success",
            title: "Sukces",
            text: "Seans został pomyślnie usunięty.",
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
            text: "Usuwanie seansu zostało anulowane.",
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

<style></style>
