<template>
  <v-app>
    <v-container>
      <v-title>
        <h1>Movie booking</h1>
      </v-title>

      <v-card class="ma-12" variant="toned">
        <v-row>
          <v-col cols="1">
            <v-img :src="movie.image" aspect-ratio="2/3" elevation-3></v-img>
          </v-col>
          <v-col cols="3">
            <h3>{{ movie.title }}</h3>
            <div class="text-grey-darken-1">
              <strong>Format:</strong> {{ movie.format }}
            </div>
            <div class="text-grey-darken-1">
              <strong>Audio:</strong> {{ movie.audio_type }}
            </div>
            <div class="text-grey-darken-1">
              <strong>Czas rozpoczęcia:</strong>
              {{ formatTime(screening.screening_time) }}
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-row>
        <v-col cols="4">
          <div>Ekran</div>
          <div class="seats">
            <div v-for="row in parseInt(hall.rows)" :key="row" class="seat-row">
              <div class="row-number">{{ row }}</div>
              <div
                v-for="seat in parseInt(hall.seats_per_row)"
                :key="seat"
                class="seat"
                :class="{
                  selected: isSelected(row, seat),
                  booked: isBooked(row, seat),
                }"
                @click="toggleSeat(row, seat)"
              >
                <!-- {{ seat }} -->
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12">
          <v-card variant="toned">
            <v-card-title>
              <h2>Wybierz miejsca</h2>
            </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-label>
                  Liczba wybranych biletów: {{ selectedSeats.length }}
                </v-label>
                <v-spacer></v-spacer>
                <v-text-field
                  v-if="showEmailField"
                  v-model="email"
                  label="Podaj adres e-mail, na który wyślemy potwierdzenie rezerwacji"
                  variant="outlined"
                  required
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn @click="bookTickets()" color="primary">
                  Potwierdzam rezerwację
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import {
  VApp,
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VRow,
  VCol,
  VImg,
  VForm,
  VLabel,
  VSpacer,
  VBtn,
} from "vuetify/lib/components";
import axios from "axios";

export default {
  components: {
    VApp,
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VRow,
    VCol,
    VImg,
    VForm,
    VLabel,
    VSpacer,
    VBtn,
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
        image: "",
        format: "",
        audio_type: "",
      },
      hall: {
        id: "",
        name: "",
        rows: 0,
        seats_per_row: 0,
      },
      screening: {
        movie_id: null,
        screening_date: "",
        screening_time: "",
        hall_id: "",
      },
      reservation: {
        reservation_code: "",
        screening_id: null,
        user_id: null,
        seat_id: null,
        status: "reserved",
        reservation_time: "",
      },
      seats: [],
      selectedSeats: [],
      showEmailField: false,
    };
  },
  created() {
    this.fetchHallData();
    this.fetchScreeningData();
  },
  methods: {
    async fetchScreeningData() {
      try {
        const screeningId = this.$route.query.screeningId;
        const response = await axios.get(
          `http://localhost:8000/api/screenings/${screeningId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.screening = response.data;
        this.screening.movie_id = this.screening.movie.id;
        this.fetchMovie();
        this.fetchSeats();
      } catch (error) {
        console.error("Błąd przy pobieraniu danych seansu:", error);
      }
    },
    async fetchMovie() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/movies/${this.screening.movie_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.movie = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych filmu:", error);
      }
    },
    async fetchHallData() {
      try {
        const hallId = this.$route.query.hallId;
        const response = await axios.get(
          `http://localhost:8000/api/halls/${hallId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.hall = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych sali:", error);
      }
    },
    async fetchSeats() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/screenings/${this.screening.id}/seats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.seats = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu miejsc:", error);
      }
    },
    isUserLoggedIn() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        this.$router.push("/login");
        // this.showEmailField = true;
      } else {
        this.showEmailField = false;
      }
    },
    toggleSeat(row, seat) {
      if (this.isBooked(row, seat)) {
        alert("To miejsce jest już zarezerwowane.");
        return;
      }

      const index = this.selectedSeats.findIndex(
        (s) => s.row === row && s.number === seat
      );

      if (index === -1) {
        this.selectedSeats.push({ row, number: seat });
      } else {
        this.selectedSeats.splice(index, 1);
      }
    },

    isSelected(row, seat) {
      return this.selectedSeats.some((s) => s.row === row && s.number === seat);
    },
    isBooked(row, seat) {
      return this.seats.some(
        (s) => s.row === row && s.number === seat && s.is_booked
      );
    },

    async bookTickets() {
      const token = localStorage.getItem("access_token");
      const isLoggedIn = !!token;
      console.log("Wybrane miejsca:", this.selectedSeats);
      if (this.selectedSeats.length === 0) {
        alert("Proszę wybrać przynajmniej jedno miejsce.");
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:8000/api/reservations",
          {
            screening_id: this.screening.id,
            seats: this.selectedSeats,
            email: isLoggedIn ? null : this.email,
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error making reservation:",
          error.response?.data || error.message
        );
      }
    },
    formatTime(time) {
      if (!time) return "";
      return time.slice(0, 5); // Zwraca tylko 5 znaków jeśli wartość w czasie jest pusta
    },
  },
};
</script>

<style>
.seat-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.row-number {
  width: 60px;
  text-align: right;
  font-weight: bold;
}
.seats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.seat {
  width: 27px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  line-height: 24px;
  background-color: white;
  border: 2px solid orange;
  transition: background-color 0.2s;
}
.seat.selected {
  background-color: orange;
}
.seat.booked {
  background-color: lightgray;
  cursor: not-allowed;
}
</style>
