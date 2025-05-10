<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card>
        <v-card-title>
          <h1>Lista Seansów</h1>
        </v-card-title>

        <v-table>
          <thead>
            <tr>
              <th>Zdjęcie</th>
              <th>Nazwa</th>
              <th>Data</th>
              <th>Godzina</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(screening, index) in screenings" :key="index">
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
              <td>
                <v-btn @click="editScreening(screening)">Edytuj</v-btn>
                <v-btn @click="deleteScreening(screening.id)">Usuń</v-btn>
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
        release_date: "",
        description: "",
        direction: "",
        script: "",
        production_year: "",
        cast: "",
        image: null,
      },
      screenings: [],
      screening: {
        movie_id: null,
        screening_date: "",
        screening_time: "",
      },
      file: null,
    };
  },
  created() {
    this.fetchScreenings();
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

    addMovie() {
      console.log("Dodawanie nowego filmu");
    },
  },
};
</script>

<style></style>
