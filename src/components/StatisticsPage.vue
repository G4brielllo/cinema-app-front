<template>
  <v-container>
    <v-card class="ma-10" variant="flat" width="100%">
      <v-row>
        <v-col>
          <v-card
            color="secondary"
            variant="flat"
            class="status-card px-4 py-3 d-flex flex-column justify-space-between"
            style="background-color: #1e1e1e; border-radius: 12px; color: white"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-subtitle-2 mb-1">Klienci</div>
                <div class="text-h5 font-weight-bold">
                  {{ numberOfClientsStatusBar }}
                </div>
              </div>
              <v-icon size="36" color="primary">mdi-account-group</v-icon>
            </div>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            color="secondary"
            variant="flat"
            class="status-card px-4 py-3 d-flex flex-column justify-space-between"
            style="background-color: #1e1e1e; border-radius: 12px; color: white"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-subtitle-2 mb-1"><strong>Przychód</strong> (w tym miesiącu)</div>
                <div class="text-h5 font-weight-bold">
                  {{ revenueStatusBar }} zł
                </div>
              </div>
              <v-icon size="36" color="primary">mdi-cash</v-icon>
            </div>
          </v-card>
        </v-col>

        <v-col>
          <v-card
            color="secondary"
            variant="flat"
            class="status-card px-4 py-3 d-flex flex-column justify-space-between"
            style="background-color: #1e1e1e; border-radius: 12px; color: white"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-subtitle-2 mb-1"><strong>Zamówienia</strong> (w tym miesiącu)</div>
                <div class="text-h5 font-weight-bold">
                  {{ numberOfOrdersStatusBar }}
                </div>
              </div>
              <v-icon size="36" color="primary">mdi-cart</v-icon>
            </div>
          </v-card>
        </v-col>

        <v-col>
          <v-card
            color="secondary"
            variant="flat"
            class="status-card px-4 py-3 d-flex flex-column justify-space-between"
            style="background-color: #1e1e1e; border-radius: 12px; color: white"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-subtitle-2 mb-1"><strong>Anulacje</strong> (w tym miesiącu)</div>
                <div class="text-h5 font-weight-bold">
                  {{ cancellationsStatusBar }}
                </div>
              </div>
              <v-icon size="36" color="primary">mdi-cancel</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card height="400px">
            <canvas ref="ordersChart" id="ordersInPeriodChart"></canvas>
            <div class="mb-4">
              <v-btn
                class="hover-btn mt-8 mr-3"
                @click="updateChartRange('week')"
                :disabled="isChartLoading"
                >Tydzień (dni)</v-btn
              >
              <v-btn
                class="hover-btn mt-8"
                @click="updateChartRange('month')"
                :disabled="isChartLoading"
                >Miesiąc (dni)</v-btn
              >
              <v-btn
                class="hover-btn mt-8 ml-3"
                @click="updateChartRange('year')"
                :disabled="isChartLoading"
                >Rok (miesiące)</v-btn
              >
            </div>
          </v-card>
        </v-col>
        <v-col>
          <v-card height="400px">
            <canvas id="topThreeMovies"></canvas>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="d-flex justify-center" height="400px">
            <canvas id="screeningsVsReservationsChart"></canvas>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { VRow, VCol, VCard, VBtn, VIcon } from "vuetify/lib/components";
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  name: "StatisticsPage",
  components: {
    VRow,
    VCol,
    VCard,
    VBtn,
    VIcon,
  },
  data() {
    return {
      users: [],
      reservations: [],
      reservationsFilteredByMonth: [],
      numberOfClientsStatusBar: 0,
      revenueStatusBar: 0,
      numberOfOrdersStatusBar: 0,
      cancellationsStatusBar: 0,

      chartInstance: null,
      selectedRange: "week",
      isChartLoading: true,
      topMoviesChartInstance: null,

      movieTitle: "",
      reservationSeats: [],
      topThreeMovies: [],
      topThreeMoviesWithTitles: [],

      screeningsVsReservationsChartInstance: null,
      screeningsVsReservationsData: [],
    };
  },
  async mounted() {
    await this.fetchReservations();
    await this.fetchUsers();
    await this.fetchReservationSeats();

    await this.countTopThreeMovies();
    await this.renderTopMoviesChart();

    await this.getScreeningsVsReservationsData();
    this.renderScreeningsVsReservationsChart();

    this.countClients();
    this.countRevenue();
    this.numberOfOrdersThisMonth();
    this.numberOfCanceledOrdersThisMonth();

    this.$nextTick(() => {
      const canvas = document.getElementById("ordersInPeriodChart");
      if (canvas) {
        this.renderChart();
      } else {
        console.warn("Wykres: ordersInPeriodChart nie został znaleziony");
      }
    });

    setTimeout(() => {
      this.isChartLoading = false;
    }, 1200);
  },

  methods: {
    getChartData() {
      const today = new Date();

      switch (this.selectedRange) {
        case "week": {
          const weekDays = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
          const weekData = Array(7).fill(0);

          const firstDayOfWeek = new Date(today);
          const day = today.getDay();
          const diffToMonday = day === 0 ? -6 : 1 - day;
          firstDayOfWeek.setDate(today.getDate() + diffToMonday);
          firstDayOfWeek.setHours(0, 0, 0, 0);

          this.reservationSeats.forEach((reservation) => {
            if (reservation.status !== "confirmed") return;

            const reservationDate = new Date(reservation.reservation_time);
            if (reservationDate >= firstDayOfWeek && reservationDate <= today) {
              const dayIndex = (reservationDate.getDay() + 6) % 7;
              weekData[dayIndex] += reservation.reservation_seats.length;
            }
          });

          return {
            labels: weekDays,
            data: weekData,
          };
        }

        case "month": {
          const daysInMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          ).getDate();
          const monthLabels = Array.from({ length: daysInMonth }, (_, i) =>
            (i + 1).toString()
          );
          const monthData = Array(daysInMonth).fill(0);

          this.reservationSeats.forEach((reservation) => {
            if (reservation.status !== "confirmed") return;

            const reservationDate = new Date(reservation.reservation_time);
            if (
              reservationDate.getMonth() === today.getMonth() &&
              reservationDate.getFullYear() === today.getFullYear()
            ) {
              const dayIndex = reservationDate.getDate() - 1;
              monthData[dayIndex] += reservation.reservation_seats.length;
            }
          });

          return {
            labels: monthLabels,
            data: monthData,
          };
        }

        case "year": {
          const yearLabels = [
            "Sty",
            "Lut",
            "Mar",
            "Kwi",
            "Maj",
            "Cze",
            "Lip",
            "Sie",
            "Wrz",
            "Paź",
            "Lis",
            "Gru",
          ];
          const yearData = Array(12).fill(0);

          this.reservationSeats.forEach((reservation) => {
            if (reservation.status !== "confirmed") return;

            const reservationDate = new Date(reservation.reservation_time);
            if (reservationDate.getFullYear() === today.getFullYear()) {
              const monthIndex = reservationDate.getMonth();
              yearData[monthIndex] += reservation.reservation_seats.length;
            }
          });

          return {
            labels: yearLabels,
            data: yearData,
          };
        }

        default:
          return { labels: [], data: [] };
      }
    },
    renderChart() {
      const canvas = this.$refs.ordersChart;
      if (!canvas) {
        console.error("Błąd ref");
        return;
      }
      const ctx = canvas.getContext("2d");

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const chartData = this.getChartData();

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Liczba zamówień",
              data: chartData.data,
              backgroundColor: "#42a5f5",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Zamówienia",
              font: {
                size: 18,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Zamówienia: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Liczba zamówień",
              },
            },
            x: {
              title: {
                display: true,
                text:
                  this.selectedRange === "week"
                    ? "Dzień tygodnia"
                    : this.selectedRange === "month"
                    ? "Dzień miesiąca"
                    : "Miesiąc",
              },
            },
          },
        },
      });
    },
    async updateChartRange(range) {
      if (this.isChartLoading) return;

      this.isChartLoading = true;
      this.selectedRange = range;

      await this.fetchReservations();
      this.renderChart();

      setTimeout(() => {
        this.isChartLoading = false;
      }, 500);
    },
    async getScreeningsVsReservationsData() {
      const movieStats = {};

      for (const reservation of this.reservationSeats) {
        const movieId = reservation.screening.movie_id;
        if (!movieStats[movieId]) {
          movieStats[movieId] = { reservations: 0, screenings: new Set() };
        }

        movieStats[movieId].reservations +=
          reservation.reservation_seats.length;
        movieStats[movieId].screenings.add(reservation.screening.id);
      }

      const result = [];

      for (const [movieId, { reservations, screenings }] of Object.entries(
        movieStats
      )) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/movies/${movieId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );

          result.push({
            title: response.data.title,
            reservations,
            screeningsCount: screenings.size,
          });
        } catch (e) {
          console.error(`Błąd przy pobieraniu tytułu filmu ID ${movieId}`, e);
        }
      }
      this.screeningsVsReservationsData = result
        .sort((a, b) => b.reservations - a.reservations)
        .slice(0, 5);
    },
    renderScreeningsVsReservationsChart() {
      if (this.screeningsVsReservationsChartInstance) {
        this.screeningsVsReservationsChartInstance.destroy();
      }

      const ctx = document
        .getElementById("screeningsVsReservationsChart")
        .getContext("2d");

      const labels = this.screeningsVsReservationsData.map(
        (movie) => movie.title
      );
      const reservationsData = this.screeningsVsReservationsData.map(
        (movie) => movie.reservations
      );
      const screeningsData = this.screeningsVsReservationsData.map(
        (movie) => movie.screeningsCount
      );

      this.screeningsVsReservationsChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Liczba rezerwacji",
              data: reservationsData,
              backgroundColor: "#42a5f5",
            },
            {
              label: "Liczba seansów",
              data: screeningsData,
              backgroundColor: "#66bb6a",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Filmy: Seanse vs Rezerwacje",
              font: {
                size: 18,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },

    async fetchReservationSeats() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/reservations_seat_detailed",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.reservationSeats = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu miejsc rezerwacji:", error);
      }
    },
    async countTopThreeMovies() {
      console.log(
        "Element reservationSeats:",
        JSON.stringify(this.reservationSeats[45], null, 2)
      );

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const filteredReservations = this.reservationSeats.filter(
        (reservation) => {
          const resTime = new Date(reservation.reservation_time);
          return (
            resTime.getFullYear() === currentYear &&
            resTime.getMonth() === currentMonth
          );
        }
      );

      const movieSeatCounts = {};

      filteredReservations.forEach((reservation) => {
        const movieId = reservation.screening.movie_id;
        const seatCount = reservation.reservation_seats.length;

        if (movieSeatCounts[movieId]) {
          movieSeatCounts[movieId] += seatCount;
        } else {
          movieSeatCounts[movieId] = seatCount;
        }
      });

      this.topThreeMovies = Object.entries(movieSeatCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([movieId, seatCount]) => ({
          movieId: Number(movieId),
          seatCount,
        }));

      await this.fetchMovieTitles();
      console.log("Top 3 filmy:", this.topThreeMovies);
    },

    async fetchMovieTitles() {
      try {
        const promises = this.topThreeMovies.map(async (movie) => {
          const response = await axios.get(
            `http://localhost:8000/api/movies/${movie.movieId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          return {
            movieId: movie.movieId,
            seatCount: movie.seatCount,
            title: response.data.title || "Brak tytułu",
          };
        });

        this.topThreeMoviesWithTitles = await Promise.all(promises);

        console.log("Top 3 filmy z tytułami:", this.topThreeMoviesWithTitles);
      } catch (error) {
        console.error("Błąd przy pobieraniu tytułów filmów:", error);
      }
    },
    getTopMoviesData() {
      const labels = this.topThreeMoviesWithTitles.map((movie) => movie.title);
      const data = this.topThreeMoviesWithTitles.map(
        (movie) => movie.seatCount
      );

      return { labels, data };
    },

    async renderTopMoviesChart() {
      if (this.topMoviesChartInstance) {
        this.topMoviesChartInstance.destroy();
      }

      const ctx = document.getElementById("topThreeMovies").getContext("2d");
      const chartData = this.getTopMoviesData();

      this.topMoviesChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.data,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Filmy - Top 3 Tego Misiąca",
              font: {
                size: 18,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Ilość rezerwacji: ${context.raw}`;
                },
              },
            },
          },
        },
      });
    },

    async fetchReservations() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/reservations/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            params: {
              sort: "reservation_time",
            },
          }
        );
        this.reservations = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu rezerwacji:", error);
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:8000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.users = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych użytkownika:", error);
      }
    },
    countClients() {
      this.numberOfClientsStatusBar = this.users.filter(
        (user) => user.role === "user"
      ).length;
    },
    numberOfOrdersThisMonth() {
      const today = new Date();
      const currentMonthReservations = this.reservations.filter(
        (reservation) => {
          const reservationDate = new Date(
            reservation.reservation_time.replace(" ", "T")
          );

          return (
            reservation.status === "confirmed" &&
            reservationDate.getFullYear() === today.getFullYear() &&
            reservationDate.getMonth() === today.getMonth()
          );
        }
      );
      this.numberOfOrdersStatusBar = currentMonthReservations.length;
    },
    numberOfCanceledOrdersThisMonth() {
      const today = new Date();
      const currentMonthReservations = this.reservations.filter(
        (reservation) => {
          const reservationDate = new Date(
            reservation.reservation_time.replace(" ", "T")
          );

          return (
            reservation.status === "refunded" &&
            reservationDate.getFullYear() === today.getFullYear() &&
            reservationDate.getMonth() === today.getMonth()
          );
        }
      );
      this.cancellationsStatusBar = currentMonthReservations.length;
    },
    countRevenue() {
      const today = new Date();
      let sum = 0;

      for (const reservation of this.reservations) {
        const reservationDate = new Date(reservation.reservation_time);

        const isSameMonth =
          reservationDate.getMonth() === today.getMonth() &&
          reservationDate.getFullYear() === today.getFullYear();

        if (reservation.status === "confirmed" && isSameMonth) {
          sum += reservation.total_amount;
        }
      }

      this.revenueStatusBar = sum / 100;
    },
  },
};
</script>

<style scoped>
.status-card {
  background-color: rgb(101, 101, 123);
}
#topThreeMovies {
  max-width: 400px;
  max-height: 600px;
  margin: auto;
}
</style>
