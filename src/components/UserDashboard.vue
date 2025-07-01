<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card width="50%">
        <v-card-text>
          <h1>Moje konto</h1>
        </v-card-text>
        <v-tabs v-model="tab" bg-color="primary" align-tabs="center">
          <v-tab value="account">Moje Konto</v-tab>
          <v-tab value="tickets">Bilety</v-tab>
          <v-tab value="three">Item Three</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="account">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="user.name"
                      variant="outlined"
                      label="Imię"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="user.surname"
                      variant="outlined"
                      label="Nazwisko"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="user.email"
                  variant="outlined"
                  label="E-mail"
                >
                </v-text-field>
                <v-text-field
                  v-model="change_form.current_password"
                  variant="outlined"
                  label="Stare Hasło"
                  type="password"
                >
                </v-text-field>
                <v-text-field
                  v-model="change_form.password"
                  variant="outlined"
                  label="Nowe Hasło"
                  type="password"
                >
                </v-text-field>

                <v-text-field
                  v-model="change_form.password_confirmation"
                  variant="outlined"
                  label="Potwierdź Hasło"
                  type="password"
                >
                </v-text-field>
                <v-btn
                  variant="outlined"
                  @click="updateUserData()"
                  style="outline: auto"
                >
                  Zapisz zmiany
                </v-btn>
              </v-container>
            </v-tabs-window-item>
            <v-tabs-window-item value="tickets">
              <v-container>
                <v-row>
                  <v-col
                    v-for="(reservation, index) in reservations"
                    :key="index"
                    cols="12"
                  >
                    <v-card>
                      <v-row>
                        <v-col cols="6">
                          <v-img
                            class="mb-4 mt-4"
                            :src="reservation.screening.movie.image"
                            aspect-ratio="1"
                            elevation-3
                          ></v-img>
                        </v-col>
                        <v-col cols="6">
                          <v-card-title>
                            <strong>
                              {{ reservation.screening.movie.title }}
                            </strong>
                          </v-card-title>
                          <v-card-text>
                            {{
                              formatDate(reservation.screening.screening_date)
                            }}
                          </v-card-text>
                          <v-card-text>
                            {{
                              formatHour(reservation.screening.screening_time)
                            }}
                          </v-card-text>
                          <v-card-text>
                            <div
                              v-for="seat in reservation.seat_data"
                              :key="seat.seat_id"
                            >
                              Rząd: {{ seat.row }}, Miejsce:
                              {{ seat.number }}
                            </div>
                          </v-card-text>

                          <v-card-text>
                            Kod rezerwacji:
                            {{ reservation.reservation_code }}
                          </v-card-text>
                          <v-btn
                            v-if="
                              checkCancelationTime(
                                reservation.screening.screening_date,
                                reservation.screening.screening_time
                              )
                            "
                            @click="cancelReservation(reservation.id)"
                          >
                            Anuluj rezerwację
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-tabs-window-item>

            <v-tabs-window-item value="three"> Three </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>
<script>
import {
  VApp,
  VContainer,
  VCard,
  VTextField,
  VBtn,
} from "vuetify/lib/components";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      user: {
        id: null,
        name: "",
        surname: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      change_form: {
        name: "",
        surname: "",
        email: "",
        current_password: "",
        new_password: "",
        password_confirmation: "",
      },
      reservations: [],
      reservation: {
        id: null,
        user_id: null,
        screening_id: null,
        code: "",
      },
      reservation_seat: {
        row: null,
        number: null,
        seat_id: null,
      },
      seat: {
        row: null,
        number: null,
        seat_id: null,
      },
      tab: null,
    };
  },
  components: {
    VApp,
    VContainer,
    VCard,
    VTextField,
    VBtn,
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await axios.get("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.user = response.data;
        this.change_form.name = this.user.name;
        this.change_form.surname = this.user.surname;
        this.change_form.email = this.user.email;
        this.change_form.current_password = "";
        this.change_form.password = "";
        this.change_form.password_confirmation = "";
        console.log(this.user);
        console.log("UserId", this.user.id);
        this.checkMyReservations();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async checkMyReservations() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/reservations/user/${this.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        this.reservations = response.data;
        console.log("Reservations", this.reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("pl-PL", options);
    },
    formatHour(time) {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    },
    checkCancelationTime(screeningDate, screeningTime) {
      const screeningDateTime = new Date(`${screeningDate}T${screeningTime}`);
      const currentTime = new Date();
      const cancelationDeadline = new Date(
        screeningDateTime.getTime() - 60 * 60 * 1000
      );
      return currentTime < cancelationDeadline;
    },
    async cancelReservation(reservationId) {
      try {
        const reservation = this.reservations.find(
          (res) => res.id === reservationId
        );
        if (!reservation) {
          console.error("Reservation not found:", reservationId);
          return;
        }
        const response = await axios.delete(
          `http://localhost:8000/api/reservations/${reservationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Reservation cancelled:", response.data);
        this.checkMyReservations();
      } catch (error) {
        console.error("Error cancelling reservation:", error);
      }
    },
    async updateUserData() {
      try {
        const payload = {
          name: this.change_form.name,
          surname: this.change_form.surname,
          email: this.change_form.email,
        };
        if (this.change_form.password) {
          payload.current_password = this.change_form.current_password;
          payload.password = this.change_form.password;
          payload.password_confirmation =
            this.change_form.password_confirmation;
        }
        const response = await axios.put(
          `http://localhost:8000/api/users/${this.user.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.showAlert("success");
        this.fetchUserData();
        console.log("User data updated:", response.data);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          if (error.response.data.errors.current_password) {
            this.showAlert("current_password_error");
          } else if (
            error.response.data.errors.password ||
            error.response.data.errors.password_confirmation
          ) {
            this.showAlert("new_password_change");
          }
        } else {
          this.showAlert("error");
        }
        console.error("Error updating user data:", error);
      }
    },
    showAlert(status) {
      if (status === "success") {
        Swal.fire({
          title: "Sukces",
          text: "Dane zostały zaktualizowane.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else if (status === "current_password_error") {
        Swal.fire({
          title: "Błąd",
          text: "Stare hasło jest niepoprawne.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (status === "new_password_change") {
        Swal.fire({
          title: "Błąd",
          text: "Podane hasła nie są zgodne.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  },
};
</script>
<style></style>
