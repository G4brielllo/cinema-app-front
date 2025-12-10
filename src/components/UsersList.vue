<template>
  <v-container fluid class="d-flex flex-column align-center">
    <v-row class="w-100" justify="center">
      <v-col cols="12" sm="12" md="10" lg="8">
        <v-card>
          <v-card-title>
            <h1 class="ma-8">Lista Użytkowników</h1>
          </v-card-title>

          <div style="overflow-x: auto">
            <v-table>
              <thead>
                <tr>
                  <th style="min-width: 120px" class="text-center">Imię</th>
                  <th style="min-width: 120px" class="text-center">Nazwisko</th>
                  <th style="min-width: 200px" class="text-center">Email</th>
                  <th style="min-width: 100px" class="text-center">Rola</th>
                  <th style="min-width: 120px" class="text-center">Akcja</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users" :key="index">
                  <td class="text-center">{{ user.name }}</td>
                  <td class="text-center">{{ user.surname }}</td>
                  <td class="text-center">{{ user.email }}</td>
                  <td class="text-center">{{ user.role }}</td>
                  <td class="text-center">
                    <v-btn
                      small
                      class="hover-btn px-3"
                      @click="confirmDeleteUser(user.id)"
                    >
                      <v-icon left>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VCard, VBtn, VTable } from "vuetify/lib/components";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: {
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
