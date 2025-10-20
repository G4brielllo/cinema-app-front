<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-row class="w-100" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <v-card class="pa-6">
          <v-card-title class="text-center">
            <h1 class="mb-4 text-h4 text-md-h3 text-lg-h2">
              {{ pageOperationType }}
            </h1>
          </v-card-title>

          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  prepend-icon="mdi-movie-open-check-outline"
                  v-model="screening.movie_id"
                  :items="movies"
                  item-title="title"
                  item-value="id"
                  label="Wybierz film"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-date-input
                  label="Data"
                  first-day-of-week="1"
                  v-model="screening.screening_date"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  prepend-icon="mdi-sofa"
                  v-model="screening.hall_id"
                  :items="halls"
                  item-title="name"
                  item-value="id"
                  label="Sala kinowa"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  prepend-icon="mdi-clock-time-five-outline"
                  v-model="screening.screening_time"
                  label="Godzina (HH:MM)"
                  required
                  @blur="formatScreeningTime"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  prepend-icon="mdi-video-3d"
                  v-model="screening.format"
                  :items="['2D', '3D']"
                  label="Format"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  prepend-icon="mdi-closed-caption-outline"
                  v-model="screening.audio_type"
                  :items="['Dubbing', 'Napisy']"
                  label="Audio"
                  required
                />
              </v-col>

              <v-col cols="12" class="text-center">
                <v-btn
                  class="hover-btn mt-4"
                  color="primary"
                  @click="
                    receivedScreeningID ? editScreening() : addScreening()
                  "
                >
                  {{ pageOperationType }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { VDateInput } from "vuetify/labs/VDateInput";
import Swal from "sweetalert2";
import {
  VContainer,
  VCard,
  VCardTitle,
  VForm,
  VSelect,
  VTextField,
  VBtn,
} from "vuetify/lib/components";

export default {
  data() {
    return {
      screening: {
        movie_id: null,
        screening_date: null,
        screening_time: "",
        format: null,
        audio_type: null,
        hall_id: null,
      },
      movies: [],
      halls: [],
      hall: {
        name: "",
        x: null,
        y: null,
      },
      receivedScreeningID: null,
      pageOperationType: "",
    };
  },
  components: {
    VContainer,
    VCard,
    VCardTitle,

    VForm,
    VSelect,
    VTextField,
    VBtn,
    VDateInput,
  },
  created() {
    this.isScreeningEditing();
    this.fetchMovies();
    this.fetchHalls();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get("http://localhost:8000/api/movies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.movies = response.data.filter(
          (movie) =>
            movie.status !== "archived" && movie.status !== "announcement"
        );
      } catch (error) {
        console.error("Błąd przy pobieraniu filmów:", error);
      }
    },
    async fetchHalls() {
      try {
        const response = await axios.get("http://localhost:8000/api/halls", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.halls = response.data;
        console.log("response", response.data);
      } catch (error) {
        console.error("Błąd przy pobieraniu hall:", error);
      }
    },

    async addScreening() {
      try {
        const payload = {
          ...this.screening,
          screening_date: this.screening.screening_date
            ? this.screening.screening_date.toLocaleDateString("fr-CA")
            : null,
        };
        const response = await axios.post(
          "http://localhost:8000/api/screenings",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log("Seans dodany:", response.data);
        this.clearForm();
        this.showAlert("add-success");
      } catch (error) {
        this.showAlert("add-error");
        console.error(
          "Błąd przy dodawaniu seansu:",
          error.response?.data || error.message
        );
      }
    },

    async editScreening() {
      try {
        const dateObj = this.screening.screening_date;
        const payload = {
          ...this.screening,
          screening_date: dateObj
            ? `${dateObj.getFullYear()}-${String(
                dateObj.getMonth() + 1
              ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
            : null,
        };
        const response = await axios.put(
          `http://localhost:8000/api/screenings/${this.receivedScreeningID}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log("Seans edytowany:", response.data);
        this.clearForm();
        this.showAlert("edit-success");
      } catch (error) {
        this.showAlert("edit-error");
        console.error(
          "Błąd przy edytowaniu seansu:",
          error.response?.data || error.message
        );
      }
    },

    async fetchScreeningData(id) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/screenings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.screening = {
          ...response.data,
          screening_date: response.data.screening_date
            ? new Date(response.data.screening_date)
            : null,
          screening_time: response.data.screening_time
            ? response.data.screening_time.slice(0, 5)
            : "",
        };
      } catch (error) {
        console.error("Błąd przy pobieraniu seansów:", error);
      }
    },

    isScreeningEditing() {
      const screeningId = this.$route.query.screeningId;
      if (screeningId) {
        this.receivedScreeningID = screeningId;
        this.pageOperationType = "Edytuj Seans";
        this.fetchScreeningData(this.receivedScreeningID);
      } else {
        this.pageOperationType = "Dodaj Seans";
      }
    },

    clearForm() {
      this.screening = {
        movie_id: null,
        screening_date: null,
        screening_time: "",
        hall_id: null,
      };
    },
    formatScreeningTime() {
      let val = this.screening.screening_time.replace(/\D/g, "");

      if (val.length === 2) {
        val = val + "00";
      }
      if (val.length === 3) {
        val = "0" + val;
      }
      if (val.length === 4) {
        const hours = parseInt(val.slice(0, 2), 10);
        const minutes = parseInt(val.slice(2, 4), 10);

        if (hours > 23 || minutes > 59) {
          this.screening.screening_time = "";
          return;
        }
        this.screening.screening_time = val.slice(0, 2) + ":" + val.slice(2, 4);
        return;
      }
      this.screening.screening_time = "";
    },
    showAlert(status) {
      if (status === "add-success") {
        Swal.fire({
          icon: "success",
          title: "Sukces",
          text: "Dodano seans.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (status === "add-error") {
        Swal.fire({
          icon: "error",
          title: "Błąd",
          text: "Nie udało się dodać seansu.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (status === "edit-success") {
        Swal.fire({
          icon: "success",
          title: "Sukces",
          text: "Edycja udana.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (status === "edit-error") {
        Swal.fire({
          icon: "error",
          title: "Błąd",
          text: "Edycja nieudana.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Błąd",
          text: "Nieoczekiwany błąd w Twojej okolicy :O",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    },
  },
};
</script>
<style scoped>
.v-card-actions {
  display: flex;
  justify-content: center;
}
</style>
