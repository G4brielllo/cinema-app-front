<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card width="50%">
        <v-card-title>
          <h1>
            <v-model>{{ pageOperationType }}</v-model>
          </h1>
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
            <v-text-field
              variant="outlined"
              v-model="movie.show_time"
              label="show-time"
              required
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="movie.duration"
              label="Czas trwania"
              required
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="movie.release_date"
              label="Data premiery"
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
            <v-select
              variant="outlined"
              v-model="movie.format"
              :items="['2D', '3D']"
              label="Format"
              required
            ></v-select>
            <v-select
              v-model="movie.audio_type"
              :items="['Dubbing', 'Napisy']"
              label="Audio"
              variant="outlined"
              required
            ></v-select>
            <v-checkbox
              v-model="movie.announcement"
              label="Zapowiedź"
            ></v-checkbox>

            <v-btn @click="receivedMovieID ? editMovie() : addMovie()"
              ><v-model>{{ pageOperationType }}</v-model></v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import {
  VApp,
  VCard,
  VTextField,
  VBtn,
  VCardText,
  VTextarea,
  VFileInput,
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
  },
  data() {
    return {
      movie: {
        title: "",
        category: "",
        show_time: "",
        duration: "",
        release_date: "",
        description: "",
        direction: "",
        script: "",
        production_year: "",
        cast: "",
        format: "",
        audio_type: "",
        announcement: false,
        image: null,
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
        const response = await axios.post(
          "http://localhost:8000/api/movies",
          this.movie,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error adding movie:",
          error.response?.data || error.message
        );
      }
      this.clearData();
    },
    async editMovie() {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/movies/${this.receivedMovieID}`,
          this.movie,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error editing movie:",
          error.response?.data || error.message
        );
      }
      this.clearData();
    },
    clearData() {
      this.movie = {
        title: "",
        category: "",
        show_time: "",
        duration: "",
        release_date: "",
        description: "",
        direction: "",
        script: "",
        production_year: "",
        cast: "",
        audio_type: "",
        format: "",
        announcement: false,
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

    isImageUrl(url) {
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
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
          announcement: Boolean(response.data.announcement), // konwertuje 1 lub 0 na true/false
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
  },
};
</script>

<style></style>
