<template>
  <v-container class="d-flex align-center justify-center">
    <v-card class="pa-6" max-width="600" width="100%">
      <v-card-title class="d-flex justify-center">
        <h1 class="text-h5 text-md-h4">Zweryfikuj rezerwację</h1>
      </v-card-title>

      <v-card-text class="text-center">
        <v-otp-input
          v-model="reservation.code"
          type="character"
          length="8"
          class="mb-4 d-flex justify-center"
          style="max-width: 100%; overflow-x: auto"
        />
        <v-btn class="hover-btn mb-2" @click="checkReservation()">
          Zweryfikuj
        </v-btn>
      </v-card-text>

      <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card class="pa-4">
          <v-card-title class="text-center">
            <h2>Szczegóły rezerwacji</h2>
          </v-card-title>

          <v-divider class="my-4"></v-divider>

          <v-card-text v-if="reservationData" class="d-flex flex-column gap-4">
            <v-card class="pa-3" variant="toned" elevation="2">
              <v-row no-gutters class="align-center">
                <v-col cols="4" class="d-flex justify-center">
                  <v-img
                    :src="reservationData.screening.movie.image"
                    alt="Plakat filmu"
                    height="120"
                    width="90"
                    class="rounded"
                  ></v-img>
                </v-col>
                <v-col cols="8" class="pl-4">
                  <h3 class="text-h6 mb-2">
                    {{ reservationData.screening.movie.title }}
                  </h3>
                  <div class="text-body-2 text-grey-darken-1">
                    <strong>Data:</strong>
                    {{ formatDate(reservationData.screening.screening_date) }}
                  </div>
                  <div class="text-body-2 text-grey-darken-1">
                    <strong>Godzina:</strong>
                    {{ formatTime(reservationData.screening.screening_time) }}
                  </div>
                  <div class="text-body-2 text-grey-darken-1">
                    <strong>Sala:</strong>
                    {{ reservationData.screening.hall_id }}
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <v-card class="pa-3" variant="toned" elevation="2">
              <h3 class="text-h6 text-center mb-3">Miejsca</h3>
              <v-row>
                <v-col
                  v-for="(seat, idx) in parsedSeats"
                  :key="idx"
                  cols="12"
                  sm="6"
                  class="d-flex justify-center"
                >
                  <v-chip color="secondary" class="text-white">
                    Rząd: {{ seat.row }} | Miejsce: {{ seat.number }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card>

            <v-card class="pa-3" variant="toned" elevation="2">
              <div class="text-center">
                <p class="mb-1 text-grey-darken-1">Kod rezerwacji:</p>
                <v-chip color="primary" variant="elevated" size="large">
                  {{ reservationData.reservation_code }}
                </v-chip>
              </div>
            </v-card>
          </v-card-text>
          <v-card-actions class="justify-center mt-4">
            <v-btn class="hover-btn" @click="dialog = false">Zamknij</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  data() {
    return {
      reservation: {
        code: "",
      },
      dialog: false,
      reservationData: null,
      parsedSeats: [],
    };
  },
  methods: {
    async checkReservation() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/reservations/${this.reservation.code}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        this.reservationData = response.data;

        let seats = [];

        if (
          Array.isArray(this.reservationData.seat_data) &&
          this.reservationData.seat_data.length
        ) {
          seats = this.reservationData.seat_data;
        } else if (
          typeof this.reservationData.selected_seats_json === "string" &&
          this.reservationData.selected_seats_json.length > 0
        ) {
          try {
            seats = JSON.parse(this.reservationData.selected_seats_json);
          } catch (e) {
            console.error("Błąd parsowania selected_seats_json:", e);
          }
        } else if (Array.isArray(this.reservationData.selected_seats_json)) {
          seats = this.reservationData.selected_seats_json;
        }

        this.parsedSeats = seats.map((s) => ({
          row: s.row || s.x,
          number: s.number || s.y,
        }));

        this.dialog = true;
      } catch (error) {
        console.error("Reservation not found or error occurred:", error);
        this.showErrorAlert();
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("pl-PL").format(date);
    },
    formatTime(timeString) {
      if (!timeString) return "";
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    showErrorAlert() {
      Swal.fire({
        title: "Błąd",
        text: "Nie znaleziono rezerwacji. Sprawdź kod.",
        icon: "error",
        showConfirmButton: false,
      });
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
.v-chip {
  font-weight: 600;
}
</style>
