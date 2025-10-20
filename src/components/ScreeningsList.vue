<template>
  <v-container fluid class="d-flex flex-column align-center">
    <v-row class="w-100 mb-6" justify="center">
      <v-col cols="12" sm="12" md="10" lg="8">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <h1 class="text-h5 text-md-h4">Lista Seansów</h1>
            <v-btn
              class="hover-btn"
              style="max-width: 70px"
              @click="goToAddScreening"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>

          <div style="overflow-x: auto">
            <v-table>
              <thead>
                <tr>
                  <th style="min-width: 100px" class="text-center">Zdjęcie</th>
                  <th style="min-width: 150px" class="text-center">Nazwa</th>
                  <th style="min-width: 120px" class="text-center">Data</th>
                  <th style="min-width: 100px" class="text-center">Godzina</th>
                  <th style="min-width: 100px" class="text-center">Status</th>
                  <th style="min-width: 120px" class="text-center">Akcja</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(screening, index) in sortedScreenings" :key="index">
                  <td class="text-center">
                    <img
                      :src="screening.movie.image"
                      alt="Screening Image"
                      style="max-width: 100px; height: auto; border-radius: 4px"
                    />
                  </td>
                  <td class="text-center">{{ screening.movie.title }}</td>
                  <td class="text-center">
                    {{ formatDate(screening.screening_date) }}
                  </td>
                  <td class="text-center">
                    {{ formatTime(screening.screening_time) }}
                  </td>
                  <td class="text-center">{{ screening.status }}</td>
                  <td class="text-center">
                    <v-btn
                      small
                      class="ma-1 hover-btn px-3"
                      @click="editScreening(screening)"
                    >
                      <v-icon left>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      small
                      class="ma-1 hover-btn px-3"
                      @click="confirmDeleteScreening(screening.id)"
                    >
                      <v-icon left>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
      </v-col>
    </v-row>
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
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("pl-PL").format(date);
    },
    formatTime(timeString) {
      if (!timeString) return "";
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      });
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

<style scoped>
th {
  text-align: center !important;
  vertical-align: middle !important;
}
td {
  text-align: center;
  vertical-align: middle;
}
</style>
