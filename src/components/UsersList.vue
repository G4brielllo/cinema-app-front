<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card>
        <v-card-title>
          <h1>Lista Użytkowników</h1>
        </v-card-title>

        <v-table>
          <thead>
            <tr>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Email</th>
              <th>Rola</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td>{{ user.name }}</td>
              <td>{{ user.surname }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <v-btn @click="confirmDeleteUser(user.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { VApp, VCard, VBtn, VTable } from "vuetify/lib/components";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: {
    VApp,
    VCard,
    VBtn,
    VTable,
  },
  data() {
    return {
      users: [],
      user: {
        id: null,
        name: "",
        surname: "",
        email: "",
        role: "",
      },
      file: null,
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:8000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.users = response.data;
      } catch (error) {
        console.error("Błąd przy pobieraniu danych uzytkownika:", error);
      }
    },

    async deleteUser(userId) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.users = this.users.filter((user) => user.id !== userId);
        console.log("Usuwanie uzytkownika o id:", userId);
      } catch (error) {
        console.error("Błąd przy usuwaniu uzytkownika:", error);
      }
    },
    confirmDeleteUser(userId) {
      Swal.fire({
        icon: "info",
        title: "Akcja wymaga potwierdzenia",
        text: "Czy na pewno chcesz usunąć użytkownika?",
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Usuń",
        denyButtonText: `Anuluj`,
        confirmButtonColor: "red",
        denyButtonColor: "lightblue",
        animation: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.deleteUser(userId);
          Swal.fire({
            icon: "success",
            title: "Sukces",
            text: "Użytkownik został pomyślnie usunięty.",
            animation: true,
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else if (result.isDenied) {
          Swal.fire({
            icon: "info",
            title: "Anulowano",
            text: "Usuwanie użytkownika zostało anulowane.",
            animation: true,
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      });
    },
  },
};
</script>

<style></style>
