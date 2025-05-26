<template>
  <v-app>
    <v-container>
      <v-card variant="toned">
        <v-card-title>
          <h1>Repertuar</h1>
        </v-card-title>
        <v-btn
          v-for="(day, index) in daysOfWeek"
          :key="index"
          class="mb-4 mx-1"
          :color="index === selectedDayIndex ? 'primary' : 'grey lighten-1'"
          @click="selectedDayIndex = index"
        >
          {{ day }}
        </v-btn>

        <v-row
          class="py-6 border-b"
          v-for="(movie, index) in filteredMovies"
          :key="index"
        >
          <v-col cols="3">
            <v-img :src="movie.image" aspect-ratio="2/3" elevation-3></v-img>
          </v-col>
          <v-col cols="3" class="d-flex flex-column justify-space-between">
            <div>
              <h1>{{ movie.title }}</h1>
              <div class="text-grey-darken-1">
                <strong
                  >{{ movie.category }} | {{ movie.duration }} min
                </strong>
              </div>
              <div class="text-grey-darken-1">
                <strong>Format:</strong> {{ movie.format }}
              </div>
              <div class="text-grey-darken-1">
                <strong>Audio:</strong> {{ movie.audio_type }}
              </div>
              <div class="text-grey-darken-1">
                <strong>Obsada:</strong> {{ movie.cast }}
              </div>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex flex-column justify-inline">
            <v-btn
              v-for="(screening, index) in filteredScreenings(movie.screenings)"
              :key="index"
              class="mb-4 mx-1"
              color="orange"
              @click="goToMovieBooking(screening.id, screening.hall_id)"
              :disabled="isPast(screening)"
            >
              {{
                formatTime(screening.screening_time, screening.screening_date)
              }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { VApp, VCard, VRow } from "vuetify/lib/components";
import "@mdi/font/css/materialdesignicons.css";
import axios from "axios";
export default {
  components: {
    VApp,
    VCard,
    VRow,
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
        format: "",
        audio_type: "",
        image: null,
      },
      file: null,
      daysOfWeek: [],
      selectedDayIndex: 0,
    };
  },
  created() {
    this.fetchMovies();
    this.setDaysOfWeek();
  },
  methods: {
    async fetchMovies() {
      //pobiera movies i screenings
      try {
        const response = await axios.get("http://localhost:8000/api/movies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.movies = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych filmów:", error);
      }
    },
    setDaysOfWeek() {
      const days = ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sb"];
      const todayIndex = new Date().getDay();
      const orderedDays = [
        ...days.slice(todayIndex),
        ...days.slice(0, todayIndex),
      ];
      orderedDays[0] = "Dziś";
      this.daysOfWeek = orderedDays;
    },
    formatTime(time, date) {
      if (!time || !date) {
        return "Nieznana godzina";
      } else {
        const datetime = `${date}T${time}`;

        const parsed = new Date(datetime);
        return isNaN(parsed)
          ? "Nieznana godzina"
          : parsed.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
      }
    },
    filteredScreenings(screenings) {
      const selectedDay = new Date();
      selectedDay.setDate(selectedDay.getDate() + this.selectedDayIndex);
      const selectedDayString = selectedDay.toISOString().split("T")[0];
      return screenings
        .filter((s) => s.screening_date === selectedDayString)
        .sort((a, b) => {
          const timeA = new Date(`${selectedDayString}T${a.screening_time}`);
          const timeB = new Date(`${selectedDayString}T${b.screening_time}`);
          return timeA - timeB;
        });
    },
    isPast(screening) {
      const now = new Date();
      const screeningDateTime = new Date(
        `${screening.screening_date}T${screening.screening_time}`
      );
      const isToday =
        screening.screening_date === now.toISOString().split("T")[0];
      return isToday && screeningDateTime < now;
    },
    goToMovieBooking(screeningId, hallId) {
      this.$router.push({
        path: "/movieBooking",
        query: { screeningId, hallId },
      });
    },
  },
  computed: {
    filteredMovies() {
      const selectedDay = new Date();
      selectedDay.setDate(selectedDay.getDate() + this.selectedDayIndex);
      const selectedDayString = selectedDay.toISOString().split("T")[0];
      return this.movies.filter((movie) =>
        movie.screenings.some(
          (screening) => screening.screening_date === selectedDayString
        )
      );
    },
  },
};
</script>

<style></style>
