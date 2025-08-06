<template>
  <v-app>
    <v-container class="d-flex justify-center">
      <v-card width="100%" class="pa-4">
        <v-card-title class="text-h4 text-center mb-4"
          >Układ Sali Kinowej</v-card-title
        >
        <v-row>
          <v-text-field
            v-model="hallName"
            label="Nazwa sali"
            outlined
            dense
            class="mb-4"
          />
        </v-row>
        <v-row class="mb-6">
          <v-col cols="6">
            <v-text-field
              v-model.number="rows"
              label="Ilość rzędów"
              type="number"
              min="1"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="cols"
              label="Ilość miejsc w rzędzie"
              type="number"
              min="1"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="screen mb-6 text-center">EKRAN</div>

        <div class="seats-container">
          <div class="seats-grid" :style="gridStyle">
            <div
              v-for="(seat, index) in seats"
              :key="index"
              :class="['seat', seat ? 'seat--occupied' : 'seat--empty']"
              @click="toggleSeat(index)"
            >
              <span v-if="seat" class="seat-label">
                {{ seat.x }}-{{ seat.y }}
              </span>
            </div>
          </div>
        </div>

        <div class="d-flex justify-center mt-6">
          <v-btn
            color="primary"
            large
            :disabled="!hasSeats"
            @click="saveLayout"
          >
            Zapisz układ sali
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  props: {
    hallId: {
      type: [Number, String],
      required: false,
    },
  },
  data() {
    return {
      hallName: "",
      rows: null,
      cols: null,
      seats: [],
    };
  },
  computed: {
    gridStyle() {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${this.cols}, 50px)`,
        gridGap: "10px",
        justifyContent: "center",
      };
    },
    hasSeats() {
      return this.seats.some((seat) => seat !== null);
    },
  },
  watch: {
    rows(value) {
      if (value === null || value === 0) {
        this.seats = [];
        return;
      }
      if (value > 300) {
        this.rows = 300;
      } else if (value < 0) {
        this.rows = 0;
        this.seats = [];
        return;
      }
      if (value > 0 && this.cols > 0) {
        this.generateSeats();
      }
    },
    cols(value) {
      if (value === null || value === 0) {
        this.seats = [];
        return;
      }
      if (value > 300) {
        this.cols = 300;
      } else if (value < 0) {
        this.cols = 0;
        this.seats = [];
        return;
      }
      if (value > 0 && this.rows > 0) {
        this.generateSeats();
      }
    },
  },
  mounted() {
    if (this.hallId) {
      this.loadHallData(this.hallId);
    }
    this.generateSeats();
  },
  methods: {
    generateSeats() {
      const seats = [];
      for (let x = 1; x <= this.rows; x++) {
        for (let y = 1; y <= this.cols; y++) {
          seats.push({ x, y });
        }
      }
      this.seats = seats;
    },
    async loadHallData(hallId) {
      try {
        const hallRes = await axios.get(
          `http://localhost:8000/api/halls/${hallId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        this.hallName = hallRes.data.name;
        this.rows = hallRes.data.rows;
        this.cols = hallRes.data.seats_per_row;

        const layoutRes = await axios.get(
          `http://localhost:8000/api/halls/${hallId}/layout`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const occupiedSeats = layoutRes.data;

        const allSeats = [];
        for (let x = 1; x <= this.rows; x++) {
          for (let y = 1; y <= this.cols; y++) {
            const seat = occupiedSeats.find((s) => s.x === x && s.y === y);
            allSeats.push(seat || null);
          }
        }

        this.seats = allSeats;
      } catch (error) {
        console.error("Błąd ładowania danych sali:", error);
      }
    },
    toggleSeat(index) {
      const seat = this.seats[index];
      this.seats[index] = seat
        ? null
        : {
            x: Math.floor(index / this.cols) + 1,
            y: (index % this.cols) + 1,
          };
    },
    async saveLayout() {
      try {
        if (!this.hallName || !this.rows || !this.cols) {
          this.showAlert("fill-hall-name");
          return;
        }

        const hallPayload = {
          name: this.hallName,
          rows: this.rows,
          seats_per_row: this.cols,
        };

        let hallId = this.hallId;

        if (hallId) {
          await axios.put(
            `http://localhost:8000/api/halls/${hallId}`,
            hallPayload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
        } else {
          const hallRes = await axios.post(
            `http://localhost:8000/api/halls`,
            hallPayload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          hallId = hallRes.data.id;
        }

        const seatsPayload = this.seats
          .filter((seat) => seat !== null)
          .map((seat) => ({ x: seat.x, y: seat.y }));

        if (seatsPayload.length === 0) {
          this.showAlert("select-seats");
          return;
        }

        await axios.post(
          `http://localhost:8000/api/halls/${hallId}/layout`,
          { seats: seatsPayload },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        this.showAlert("add-success");

        this.clearData();

        this.$router.push("/"); // wróć np. na listę sal
      } catch (error) {
        console.error(
          "Błąd zapisu układu:",
          error.response?.data || error.message
        );
        this.showAlert("error");
      }
    },
    clearData() {
      this.hallName = "";
      this.rows = null;
      this.cols = null;
      this.seats = [];
    },
    showAlert(status) {
      if (status === "add-success") {
        Swal.fire({
          icon: "success",
          title: "Sukces",
          text: "Dodano salę kinową.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (status === "select-seats") {
        Swal.fire({
          icon: "warning",
          title: "Uwaga",
          text: "Zaznacz przynajmniej jedno miejsce.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (status === "fill-hall-name") {
        Swal.fire({
          icon: "warning",
          title: "Uwaga",
          text: "Wymagane uzupełnienie nazwy sali kinowej.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Błąd",
          text: "Dodanie sali kinowej nie powiodło się.",
          animation: true,
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    },
  },
};
</script>

<style scoped>
.screen {
  background: #424242;
  color: white;
  text-align: center;
  padding: 10px;
  margin: 0 auto 20px;
  width: 70%;
  border-radius: 4px;
  font-weight: bold;
}

.seats-container {
  max-height: 600px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.seats-grid {
  margin: 0 auto;
}

.seat {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 10px;
  font-weight: bold;
}

.seat--empty {
  background-color: #e0e0e0;
  border: 1px solid #bdbdbd;
}

.seat--occupied {
  background-color: #4caf50;
  color: white;
  border: 1px solid #388e3c;
}

.seat:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.seat-label {
  user-select: none;
}

@media (max-width: 600px) {
  .seat {
    width: 30px;
    height: 30px;
    font-size: 8px;
  }

  .seats-grid {
    grid-template-columns: repeat(auto-fill, 30px) !important;
  }
}
</style>
