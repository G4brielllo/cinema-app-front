<template>
  <v-container>
    <v-card class="w-100" variant="toned">
      <v-card class="ma-6 pa-6" variant="toned">
        <v-row class="d-flex align-center flex-wrap">
          <v-col
            xs="4"
            sm="3"
            md="2"
            class="d-flex justify-center justify-sm-start"
          >
            <v-img
              :src="movie.image"
              class="rounded-lg"
              height="160"
              width="110"
              contain
            ></v-img>
          </v-col>
          <v-col
            xs="8"
            sm="9"
            md="6"
            class="d-flex flex-column text-center text-sm-start"
          >
            <h2 class="text-sm-h5 text-md-h4">{{ movie.title }}</h2>
            <div class="text-grey-darken-1 mb-1">
              <strong>Format:</strong> {{ screening.format }}
            </div>
            <div class="text-grey-darken-1 mb-1">
              <strong>Audio:</strong> {{ screening.audio_type }}
            </div>
            <div class="text-grey-darken-1 mb-1">
              <strong>Czas rozpoczęcia:</strong>
              {{ formatTime(screening.screening_time) }}
            </div>
            <div class="mb-1 font-weight-bold text-red">
              Czas do finalizacji zamówienia: {{ formatCountdown }}
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-row class="mb-12">
        <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="text-center">
          <div class="screen-container">
            <div class="screen"></div>
          </div>

          <div class="seats">
            <div v-for="row in parseInt(hall.rows)" :key="row" class="seat-row">
              <div class="row-number">{{ row }}</div>
              <div
                v-for="seat in parseInt(hall.seats_per_row)"
                :key="seat"
                class="seat"
                :class="{
                  available: isAvailable(row, seat),
                  booked: isBooked(row, seat),
                  selected: isSelected(row, seat),
                  hidden: !isAvailable(row, seat),
                }"
                @click="toggleSeat(row, seat)"
              ></div>
            </div>
          </div>
        </v-col>

        <v-col
          class="text-center justify-sm-center"
          cols="12"
          xs="12"
          sm="12"
          md="4"
        >
          <v-card variant="toned">
            <h1>Wybierz miejsca</h1>
            <v-card-text>
              <v-form ref="form">
                <h3 class="text-center">
                  Liczba wybranych biletów: {{ selectedSeats.length }}
                </h3>

                <div v-if="selectedSeats.length" class="my-4">
                  <h3
                    v-for="(seat, index) in selectedSeats"
                    :key="index"
                    class=" text-center"
                  >
                    Rząd {{ seat.row }}, Miejsce {{ seat.number }}
                </h3>
                </div>
                <div class="text-center">
                  <v-btn
                    class="hover-btn mt-4"
                    :disabled="screening.status === 'archived'"
                    @click="bookTickets()"
                  >
                    Potwierdzam rezerwację
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="showLoginModal" max-width="500">
        <v-card>
          <v-card-title>Zaloguj się</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.email"
              label="Email"
              type="email"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              label="Hasło"
              type="password"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="login">Zaloguj</v-btn>
            <v-spacer></v-spacer>
            <v-btn text @click="showLoginModal = false">Anuluj</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import {
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VRow,
  VCol,
  VImg,
  VForm,
  VSpacer,
  VBtn,
  VDialog,
} from "vuetify/lib/components";
import axios from "axios";

export default {
  components: {
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VRow,
    VCol,
    VImg,
    VForm,

    VSpacer,
    VBtn,
    VDialog,
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
      user: {
        email: "",
        password: "",
        access_token: "",
      },
      screeningId: null,
      seats: [],
      selectedSeats: [],
      bookedSeatIds: [],
      availableSeats: [],
      showEmailField: false,
      currentSelectedSeat: null,
      countdownTime: 600,
      showLoginModal: false,
    };
  },
  created() {
    this.fetchHallData();
    this.fetchScreeningData();
    this.startCountdown();
  },

  computed: {
    formatCountdown() {
      const minutes = Math.floor(this.countdownTime / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (this.countdownTime % 60).toString().padStart(2, "0");
      return `${minutes}:${seconds}`;
    },
  },
  async mounted() {
    await this.fetchBookedSeats();
  },
  methods: {
    async fetchScreeningData() {
      try {
        const screeningId = this.$route.query.screeningId;
        this.screeningId = screeningId;
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
        this.hallId = this.screening.hall_id;
        this.fetchMovie();
        this.fetchSeats();
        await this.fetchAvailableSeats();
      } catch (error) {
        console.error("Błąd przy pobieraniu danych seansu:", error);
      }
    },
    async fetchAvailableSeats() {
      const response = await axios.get(
        `http://localhost:8000/api/halls/${this.hallId}/available-seats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      this.availableSeats = response.data.availableSeats;
      this.totalRows = response.data.totalRows;
      this.totalCols = response.data.totalCols;
    },

    async fetchBookedSeats() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/reservations/${this.screeningId}/booked-seats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.bookedSeatIds = response.data;
      } catch (error) {
        console.error("Error fetching booked seats:", error);
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
        const res = await axios.get(
          `http://localhost:8000/api/hall-seats/${this.screening.hall_id}`
        );
        this.seats = res.data;
        console.log("Pobrane miejsca:", this.seats);
      } catch (error) {
        console.error("Błąd podczas pobierania miejsc z sali:", error);
      }
    },
    isUserLoggedIn() {
      const token = localStorage.getItem("access_token");
      this.showEmailField = !this.access_token;
      if (!token) {
        this.showLoginModal = true;
      } else {
        this.showLoginModal = false;
      }
    },
    toggleSeat(row, seat) {
      if (this.isBooked(row, seat)) {
        this.showAlert("reserved_seat");
        return;
      }

      const index = this.selectedSeats.findIndex(
        (s) => s.row === row && s.number === seat
      );
      console.log("zaznaczone miejsca:", this.selectedSeats);
      if (index === -1) {
        const hallSeat = this.seats.find((s) => s.x === row && s.y === seat);

        if (!hallSeat) {
          console.warn(
            `Nie znaleziono miejsca w bazie dla x=${row}, y=${seat}`
          );
          return;
        }

        this.selectedSeats.push({
          row,
          number: seat,
          hall_seat_id: hallSeat.id,
        });

        this.currentSelectedSeat = { row, number: seat };
      } else {
        this.selectedSeats.splice(index, 1);
        this.currentSelectedSeat = null;
      }
    },

    isSelected(row, seat) {
      return this.selectedSeats.some((s) => s.row === row && s.number === seat);
    },
    isAvailable(row, seat) {
      return this.availableSeats.some((s) => s.x === row && s.y === seat);
    },

    isBooked(row, seat) {
      const matchingSeat = this.availableSeats.find(
        (s) => s.x === row && s.y === seat
      );
      return matchingSeat && this.bookedSeatIds.includes(matchingSeat.id);
    },
    formatTime(time) {
      if (!time) return "";
      return time.slice(0, 5);
    },
    startCountdown() {
      const timer = setInterval(() => {
        if (this.countdownTime > 0) {
          this.countdownTime--;
        } else {
          clearInterval(timer);
          location.reload();
        }
      }, 1000);
    },

    async login() {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/login",
          this.user
        );
        localStorage.setItem("access_token", response.data.access_token);
        this.showLoginModal = false;
        this.showEmailField = false;
        this.user.email = "";
        this.user.password = "";

        location.reload();
      } catch (error) {
        console.error("Login failed", error.response?.data || error.message);
        alert(
          "Błąd logowania: " + (error.response?.data?.message || error.message)
        );
      }
    },
    async startPayment() {
      console.log(this.reservation.reservation_code);

      try {
        const res = await fetch("http://127.0.0.1:8000/api/payu/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notifyUrl: "https://72f306caa966.ngrok-free.app/api/payu/notify",
            continueUrl: "https://72f306caa966.ngrok-free.app/paymentStatus",
            extOrderId: this.reservation.reservation_code,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          Swal.fire({
            iconHtml: "?",
            title: "Błąd serwera",
            text:
              "Nie udało się utworzyć zamówienia. Odpowiedź serwera: " + text,
          });
          return;
        }

        const json = await res.json();

        if (json.data && json.data.redirectUri) {
          window.location.href = json.data.redirectUri;
        } else {
          alert(
            "Nie udało się przekierować do płatności. Odpowiedź: " +
              JSON.stringify(json)
          );
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Błąd serwera",
          text:
            "Nie udało się utworzyć zamówienia. Odpowiedź serwera: " + error,
        });
      }
    },
    async bookTickets() {
      this.isUserLoggedIn();
      const token = localStorage.getItem("access_token");
      const isLoggedIn = !!token;
      if (!isLoggedIn && !this.user.email) {
        return;
      }
      if (this.selectedSeats.length === 0) {
        this.showAlert("select_seats");
        return;
      }
      try {
        console.log("selectedSeats:", this.selectedSeats);

        // console.log("hallSeatId:", this.seat.id);
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
        this.reservation.reservation_code = response.data.reservation_code;
        console.log("eluwina", response.data);
        await this.startPayment();
      } catch (error) {
        console.error("Error making reservation:", error);

        if (error.response) {
          console.error("Server responded with:", error.response.data);
        } else {
          console.error("Other error:", error.message);
        }

        this.showAlert("reservation_failed");
      }
    },
    showAlert(status) {
      if (status === "success") {
        Swal.fire({
          icon: "success",
          title: "Rezerwacja zakończona sukcesem",
          text: `Kod rezerwacji: ${this.reservation.reservation_code}`,
        });
      } else if (status === "reserved_seat") {
        Swal.fire({
          icon: "info",
          title: "Miejsce już zarezerwowane",
          text: "Proszę wybrać inne miejsce.",
        });
      } else if (status === "select_seats") {
        Swal.fire({
          icon: "warning",
          title: "Nie wybrano miejsc",
          text: "Proszę wybrać miejsca przed dokonaniem rezerwacji.",
        });
      } else if (status === "add-error") {
        Swal.fire({
          icon: "error",
          title: "Błąd",
          text: "Nie udało się dodać seansu.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Błąd",
          text: "Nie udało się zarezerwować miejsc.",
        });
      }
    },
  },
};
</script>

<style scoped>
.screen-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 30px auto;
  height: 30px;
  overflow: hidden;
}

.screen {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 15px;
  background: linear-gradient(to top, #ccc 0%, #f5f5f5 100%);
  border-radius: 50% / 100% 100% 0 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.seats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
}

.seat-row {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 4px;
  width: 100%;
  max-width: 100%;
}

.row-number {
  width: 28px;
  text-align: right;
  font-weight: bold;
  flex-shrink: 0;
}

.seat {
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  border: 2px solid orange;
  background-color: white;
  transition: background-color 0.2s;
  flex: 1 1 auto;
  max-width: 32px;
  min-width: 16px;
}

.selected {
  background-color: orange;
}
.booked {
  background-color: lightgray;
  cursor: not-allowed;
}
.hidden {
  visibility: hidden;
}

@media (max-width: 768px) {
  .seat {
    max-width: 24px;
  }
}
@media (max-width: 480px) {
  .seat {
    max-width: 18px;
    border-width: 1px;
  }
}
</style>
