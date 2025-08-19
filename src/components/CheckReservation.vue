<template>
  <v-container class="d-flex align-center justify-center">
    <v-card width="50%">
      <v-card-title><h1>Rezerwacja</h1></v-card-title>

      <v-otp-input v-model="reservation.code" type="character" length="8" />
      <v-card-actions>
        <v-btn class="hover-btn mb-2" @click="checkReservation()"
          >Zweryfikuj</v-btn
        >
      </v-card-actions>

      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <h2>Szczegóły rezerwacji</h2>
          </v-card-title>

          <v-card-text v-if="reservationData">
            <p><strong>Email:</strong> {{ reservationData.user.email }}</p>
            <p><strong>Imię:</strong> {{ reservationData.user.name }}</p>
            <p><strong>Nazwisko:</strong> {{ reservationData.user.surname }}</p>
            <p>
              <strong>Film:</strong> {{ reservationData.screening.movie.title }}
            </p>
            <p>
              <strong>Data seansu:</strong>
              {{ reservationData.screening.screening_date }}
            </p>
            <p>
              <strong>Godzina:</strong>
              {{ reservationData.screening.screening_time }}
            </p>
            <p>
              <strong>Sala Kinowa:</strong>
              {{ reservationData.screening.hall_id }}
            </p>

            <div>
              <p><strong>Rzędy i miejsca:</strong></p>
              <ul>
                <li v-for="(seat, idx) in parsedSeats" :key="idx">
                  Rząd: {{ seat.row }} | Miejsce: {{ seat.number }}
                </li>
              </ul>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="dialog = false">Zamknij</v-btn>
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

        try {
          this.parsedSeats = JSON.parse(
            this.reservationData.selected_seats_json
          );
          console.log("Parsed seats:", this.parsedSeats);
        } catch (parseError) {
          console.error("Błąd parsowania miejsc:", parseError);
          this.parsedSeats = [];
        }

        // Przenieś dialog na koniec, po przypisaniu danych
        this.dialog = true;
      } catch (error) {
        console.error("Reservation not found or error occurred:", error);
        this.showErrorAlert();
      }
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

<style></style>
