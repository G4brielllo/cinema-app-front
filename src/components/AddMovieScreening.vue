<template>
    <v-app>
      <v-container class="d-flex justify-center align-center">
        <v-card width="50%">
          <v-card-title>
            <h1>Dodaj Seans</h1>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-select
                v-model="screening.movie_id"
                :items="movies"
                item-title="title"
                item-value="id"
                label="Wybierz film"
                variant="outlined"
                required
              ></v-select>
              
              <!-- <v-select
                v-model="screening.hall_id"
                :items=[1]
                label="Wybierz halę"
                variant="outlined"
                required
              ></v-select> -->
              
              <v-text-field
              v-model="screening.screening_date"
              label="Data (YYYY-MM-DD)"
              variant="outlined"
              required
              ></v-text-field>
              
              <!-- <v-date-picker
              v-model="screening.screening_date"
              label="Data (YYYY-MM-DD)"
              variant="outlined"
              required
              ></v-date-picker> -->
              
              <v-text-field
              v-model="screening.screening_time"
              label="Godzina (HH:MM)"
              variant="outlined"
              required
              ></v-text-field>
  
              <v-btn @click="addScreening" color="primary">Dodaj Seans</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import axios from "axios";
  import { VApp, VContainer, VCard, VCardTitle, VCardText, VForm, VSelect, VTextField, VBtn } from "vuetify/lib/components";
  export default {
    data() {
      return {
        screening: {
          movie_id: null,
          screening_date: "",
          screening_time: "",
          hall_id: 1, // domyślnie 1 - bo jedna sala
          // hall_id: "",
        },
        movies: [],
      };
    },
    components:{
        VApp,
        VContainer,
        VCard,
        VCardTitle,
        VCardText,
        VForm,
        VSelect,
        VTextField,
        VBtn,

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
          console.error("Błąd przy pobieraniu filmów:", error);
        }
      },
      async addScreening() {
        try {
          const response = await axios.post(
            "http://localhost:8000/api/screenings",
            this.screening,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          console.log("Seans dodany:", response.data);
          this.clearForm();
        } catch (error) {
          console.error("Błąd przy dodawaniu seansu:", error.response?.data || error.message);
        }
      },
      clearForm() {
        this.screening = {
          movie_id: null,
          screening_date: "",
          screening_time: "",
          hall_id: "",
        };
      },
    },
  };
  </script>
  