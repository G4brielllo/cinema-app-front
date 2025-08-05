<template>
  <v-app>
    <v-container class="d-flex justify-center">
      <v-card width="100%" class="pa-4">
        <v-card-title class="text-h4 text-center mb-4">Lista sal</v-card-title>
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
                <v-btn @click="editHall(hall.id)">Edytuj</v-btn>
                <v-btn @click="deleteHall(hall.id)">Usuń</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-btn color="primary" @click="$router.push({ name: 'AddHall' })"
          >Dodaj nową salę</v-btn
        >
      </v-card>
    </v-container>
  </v-app>
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
    editHall(id) {
      this.$router.push({ name: "EditHall", params: {hallId: id } });
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
<style></style>
