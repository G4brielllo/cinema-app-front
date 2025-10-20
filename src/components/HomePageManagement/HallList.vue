<template>
  <v-container>
    <v-card width="100%" class="pa-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <h1 class="mb-4">Lista Sal Kinowych</h1>
        <v-btn
          class="hover-btn"
          style="max-width: 70px"
          @click="$router.push({ name: 'AddHall' })"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Ilość rzędów</th>
            <th>Ilość miejsc</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hall in halls" :key="hall.id">
            <td>{{ hall.name }}</td>
            <td>{{ hall.rows }}</td>
            <td>{{ hall.seats_per_row }}</td>
            <td>
              <v-btn class="ma-1 hover-btn" @click="editHall(hall.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn class="ma-1 hover-btn" @click="deleteHall(hall.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      halls: [],
      hall: {
        name: "",
        rows: "",
        seats_per_row: "",
      },
      file: null,
    };
  },
  created() {
    this.fetchHalls();
  },
  methods: {
    async fetchHalls() {
      try {
        const response = await axios.get("http://localhost:8000/api/halls", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.halls = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych filmów:", error);
      }
    },
    goToAddHall() {
      this.$router.push("/hall/add");
    },
    editHall(id) {
      this.$router.push({ name: "EditHall", params: { hallId: id } });
    },
    async deleteHall(id) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/halls/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        this.halls = response.data;
      } catch (error) {
        console.error("Błąd podczas usuwania sali:", error);
      }
    },
  },
};
</script>
<style scoped>
th {
  text-align: center !important;
  vertical-align: middle !important;
}
td {
  text-align: center;
  vertical-align: middle;
}
</style>
