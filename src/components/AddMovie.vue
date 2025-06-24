<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card width="50%">
        <v-card-title>
          <h1>{{ pageOperationType }}</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              variant="outlined"
              v-model="movie.title"
              label="Tytuł"
              required
            ></v-text-field>
            <v-select
              v-model="movie.category"
              :items="[
                'Akcja',
                'Komedia',
                'Dramat',
                'Animacja',
                'Fantasy',
                'Science Fiction (Sci-Fi)',
                'Horror',
                'Romans',
                'Thriller',
                'Przygodowy',
              ]"
              label="Kategoria"
              variant="outlined"
              required
            ></v-select>
            <v-date-input
              label="Data Rozpoczęcia Emisji"
              first-day-of-week="1"
              v-model="movie.playing_from"
              variant="outlined"
              required
            ></v-date-input>
            <v-date-input
              label="Data Zakończenia Emisji"
              first-day-of-week="1"
              v-model="movie.playing_until"
              variant="outlined"
              required
            ></v-date-input>
            <v-text-field
              variant="outlined"
              v-model="movie.duration"
              label="Czas trwania (w minutach)"
              required
            ></v-text-field>
            <v-file-input
              variant="outlined"
              v-model="file"
              accept="image/*"
              @change="createBase64Image"
              label="Zdjęcie"
              required
            ></v-file-input>
            <div v-if="movie.image">
              <img
                :src="movie.image"
                alt="Zdjęcie filmu"
                style="max-width: 100px; max-height: 100px"
              />
            </div>
            <v-text-field
              variant="outlined"
              v-model="movie.trailer"
              label="Trailer (Link)"
              required
            >
            </v-text-field>
            <v-textarea
              variant="outlined"
              v-model="movie.description"
              label="Opis"
              required
              auto-grow
              rows="6"
            ></v-textarea>
            <v-text-field
              variant="outlined"
              v-model="movie.direction"
              label="Reżyseria"
              required
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="movie.script"
              label="Scenariusz"
              required
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="movie.production_year"
              label="Rok produkcji"
              required
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="movie.cast"
              label="Obsada"
              required
            ></v-text-field>
            <v-switch
              v-model="movie.status"
              :true-value="'announcement'"
              :false-value="'movie'"
              label="Zapowiedź"
            ></v-switch>
            <v-btn @click="receivedMovieID ? editMovie() : addMovie()">
              {{ pageOperationType }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { VDateInput } from "vuetify/labs/VDateInput";
import { format } from "date-fns";

import {
  VApp,
  VCard,
  VTextField,
  VBtn,
  VCardText,
  VTextarea,
  VFileInput,
  VSelect,
  VForm,
  VSwitch,
} from "vuetify/lib/components";
import axios from "axios";

export default {
  components: {
    VApp,
    VCard,
    VFileInput,
    VTextField,
    VTextarea,
    VBtn,
    VCardText,
    VDateInput,
    VSelect,
    VSwitch,
    VForm,
  },
  data() {
    return {
      movie: {
        title: "",
        category: "",
        playing_from: "",
        playing_until: "",
        duration: "",
        description: "",
        direction: "",
        script: "",
        production_year: "",
        cast: "",
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
        this.clearData();
      } catch (error) {
        console.error(
          "Błąd podczas dodawania filmu:",
          error.response?.data || error.message
        );
        alert(error.message);
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
            withCredentials: true, // jeśli używasz Laravel Sanctum
          }
        );

        // console.log(response.data);
        this.clearData();
      } catch (error) {
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
        production_year: "",
        cast: "",
        image: null,
      };
      this.file = null;
      this.receivedMovieID = null;
    },
    createBase64Image(event) {
      const file = event.target.files[0];
      if (!(file instanceof Blob)) {
        console.error("Niepoprawny typ pliku:", file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.movie.image = e.target.result; // base64
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
        // Jeśli switch jest włączony (true), status to "announcement"
        // Jeśli wyłączony (false), status to "movie"
        this.movie.status = val ? "announcement" : "movie";
      },
    },
  },
};
</script>

<style></style>
