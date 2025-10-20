<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-row class="w-100" justify="center">
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="6"
        xl="5"
      >
        <v-card class="pa-6">
          <v-card-title class="text-center">
            <h1 class="mb-4 text-h4 text-md-h3 text-lg-h2">{{ pageOperationType }}</h1>
          </v-card-title>

          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="movie.title"
                  label="Tytuł"
                  prepend-icon="mdi-format-title"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="movie.category"
                  :items="[
                    'Akcja','Komedia','Dramat','Animacja','Fantasy',
                    'Science Fiction (Sci-Fi)','Horror','Romans',
                    'Thriller','Przygodowy'
                  ]"
                  label="Kategoria"
                  prepend-icon="mdi-shape-outline"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="movie.age_group"
                  :items="['Dzieci', 'Młodzież', 'Dorośli']"
                  label="Grupa wiekowa"
                  prepend-icon="mdi-account-supervisor"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-date-input
                  label="Data rozpoczęcia emisji"
                  prepend-icon="mdi-calendar-start"
                  v-model="movie.playing_from"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-date-input
                  label="Data zakończenia emisji"
                  prepend-icon="mdi-calendar-end"
                  v-model="movie.playing_until"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  prepend-icon="mdi-clock-time-five-outline"
                  v-model="movie.duration"
                  label="Czas trwania (minuty)"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="file"
                  accept="image/*"
                  @change="createBase64Image"
                  label="Zdjęcie"
                  required
                />
                <div v-if="movie.image" class="mt-2 d-flex justify-center">
                  <img
                    :src="movie.image"
                    alt="Zdjęcie filmu"
                    style="max-width: 120px; border-radius: 8px;"
                  />
                </div>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-youtube"
                  v-model="movie.trailer"
                  label="Trailer (Link)"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  prepend-inner-icon="mdi-text-long"
                  v-model="movie.description"
                  label="Opis"
                  variant="underlined"
                  auto-grow
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  prepend-icon="mdi-account-tie"
                  v-model="movie.direction"
                  label="Reżyseria"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  prepend-icon="mdi-script-outline"
                  v-model="movie.script"
                  label="Scenariusz"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-account-group-outline"
                  v-model="movie.cast"
                  label="Obsada"
                />
              </v-col>

              <v-col cols="12">
                <div class="d-flex justify-space-between align-center">
                  <h3 class="m-0">Zapowiedź</h3>
                  <v-switch
                    v-model="movie.status"
                    color="secondary"
                    :true-value="'announcement'"
                    :false-value="'movie'"
                    inset
                  />
                </div>
              </v-col>

              <v-col cols="12" class="text-center">
                <v-btn
                  class="hover-btn mt-4"
                  color="primary"
                  @click="receivedMovieID ? editMovie() : addMovie()"
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
import { VDateInput } from "vuetify/labs/VDateInput";
import { format } from "date-fns";
import Swal from "sweetalert2";

import {
  VCard,
  VTextField,
  VBtn,
  VTextarea,
  VFileInput,
  VSelect,
  VForm,
  VSwitch,
} from "vuetify/lib/components";
import axios from "axios";

export default {
  components: {
    VCard,
    VFileInput,
    VTextField,
    VTextarea,
    VBtn,

    VDateInput,
    VSelect,
    VSwitch,
    VForm,
  },
  data() {
    return {
      movie: {
        title: "",
        category: null,
        playing_from: "",
        playing_until: "",
        duration: "",
        description: "",
        direction: "",
        script: "",
        cast: "",
        age_group: null,
        announcement: false,
        image: null,
        trailer: null,
      },
      file: null,
      receivedMovieID: null,
      pageOperationType: "",
    };
  },
  created() {
    this.isMovieEditing();
    this.changeTitle();
  },
  methods: {
    async addMovie() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const playingUntilDate = new Date(this.movie.playing_until);
        playingUntilDate.setHours(0, 0, 0, 0);

        if (playingUntilDate < today) {
          throw new Error(
            "Data Zakończenia Emisji nie może być wcześniejsza niż dzisiejsza data!"
          );
        }

        const payload = {
          ...this.movie,
          playing_from: format(new Date(this.movie.playing_from), "yyyy-MM-dd"),
          playing_until: format(
            new Date(this.movie.playing_until),
            "yyyy-MM-dd"
          ),
        };

        const response = await axios.post(
          "http://localhost:8000/api/movies",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log(response.data);
        this.showAlert("add-success");
        this.clearData();
      } catch (error) {
        this.showAlert("add-error");
        console.error(
          "Błąd podczas dodawania filmu:",
          error.response?.data || error.message
        );
        // alert(error.message);
      }
    },

    async editMovie() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const playingUntilDate = new Date(this.movie.playing_until);
        playingUntilDate.setHours(0, 0, 0, 0);

        if (playingUntilDate < today) {
          throw new Error(
            "Data Zakończenia Emisji nie może być wcześniejsza niż dzisiejsza data!"
          );
        }
        const payload = {
          ...this.movie,
          playing_from: format(new Date(this.movie.playing_from), "yyyy-MM-dd"),
          playing_until: format(
            new Date(this.movie.playing_until),
            "yyyy-MM-dd"
          ),
        };
        await axios.put(
          `http://localhost:8000/api/movies/${this.receivedMovieID}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            withCredentials: true,
          }
        );
        this.showAlert("edit-success");
        this.clearData();
      } catch (error) {
        this.showAlert("edit-error");
        console.error(
          "Error editing movie:",
          error.response?.data || error.message
        );
      }
    },
    clearData() {
      this.movie = {
        title: "",
        category: "",
        playing_from: "",
        playing_until: "",
        duration: "",
        description: "",
        direction: "",
        script: "",
        cast: "",
        age_group: "",
        image: null,
      };
      this.file = null;
      this.receivedMovieID = null;
    },
    createBase64Image(event) {
      const file = event.target.files[0];

      if (!file) {
        console.warn("Nie wybrano pliku");
        return;
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ];

      if (!allowedTypes.includes(file.type)) {
        console.error("Nieobsługiwany format obrazu:", file.type);
        alert("Dozwolone formaty: JPG, PNG, WEBP, GIF, SVG");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.movie.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    isMovieEditing() {
      if (this.$route.query.movieId !== undefined) {
        this.receivedMovieID = this.$route.query.movieId;
        console.log("Received movie ID:", this.receivedMovieID);
        this.fetchMovieData(this.receivedMovieID);
      }
    },
    async fetchMovieData(id) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/movies/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.movie = {
          ...response.data,
          announcement: Boolean(response.data.announcement),
        };
        console.log("Fetched movie data:", this.movie);
      } catch (error) {
        console.error("Błąd przy pobieraniu danych filmów:", error);
      }
    },
    changeTitle() {
      if (this.$route.query.movieId !== undefined) {
        this.pageOperationType = "Edytuj Film";
      } else {
        this.pageOperationType = "Dodaj Film";
      }
    },
    watch: {
      "movie.status"(val) {
        this.movie.status = val ? "announcement" : "movie";
      },
    },
    showAlert(status) {
      if (status === "add-success") {
        Swal.fire({
          icon: "success",
          title: "Sukces",
          text: "Dodano film.",
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
          text: "Nie udało się dodać filmu.",
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
          icon: "eroor",
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
