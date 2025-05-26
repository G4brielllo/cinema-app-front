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
            <v-select
              v-model="screening.movie_id"
              :items="movies"
              item-title="title"
              item-value="id"
              label="Wybierz film"
              variant="outlined"
              required
            ></v-select>

            <v-date-input
              label="Data (YYYY-MM-DD)"
              v-model="screening.screening_date"
              variant="outlined"
              required
            ></v-date-input>
            <v-text-field
              v-model="screening.screening_time"
              label="Godzina (HH:MM)"
              variant="outlined"
              required
            ></v-text-field>

            <v-btn
              @click="receivedScreeningID ? editScreening() : addScreening()"
              color="primary"
              ><v-model>{{ pageOperationType }}</v-model></v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import { VDateInput } from "vuetify/labs/VDateInput";
import {
  VApp,
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
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
        hall_id: 1,
      },
      movies: [],
      receivedScreeningID: null,
      pageOperationType: "",
    };
  },
  components: {
    VApp,
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VForm,
    VSelect,
    VTextField,
    VBtn,
    VDateInput,
  },
  created() {
    this.isScreeningEditing();
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
        const payload = {
          ...this.screening,
          screening_date: this.screening.screening_date
  ? this.screening.screening_date.toLocaleDateString('fr-CA')
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
      } catch (error) {
        console.error(
          "Błąd przy dodawaniu seansu:",
          error.response?.data || error.message
        );
      }
    },

    async editScreening() {
      try {
        const payload = {
          ...this.screening,
          screening_date: this.screening.screening_date
            ? this.screening.screening_date.toISOString().split("T")[0]
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
      } catch (error) {
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
        };
      } catch (error) {
        console.error("Błąd przy pobieraniu seansów:", error);
      }
    },

    isScreeningEditing() {
      const screeningId = this.$route.query.screeningId;
      if (screeningId) {
        this.receivedScreeningID = screeningId;
        this.pageOperationType = "Edycja Seansu";
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
        hall_id: 1,
      };
    },
  },
};
</script>
