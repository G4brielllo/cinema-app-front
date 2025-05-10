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
                  <v-btn @click="editMovie(user)">Edytuj</v-btn>
                  <v-btn @click="deleteUser(user.id)">Usuń</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
  
          <v-card-actions>
            <v-btn style="outline: auto" @click="addMovie">Dodaj</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import { VApp, VCard, VBtn, VTable } from "vuetify/lib/components";
  import axios from "axios";
  
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
  
      editUser(user) {
        console.log("Edytowanie filmu:", user);
  
        this.$router.push({
          path: "/addUser", 
          query: { userId: user.id },
        });
  
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
  
      addMovie() {
        console.log("Dodawanie nowego filmu");
      },
    },
  };
  </script>
  
  <style></style>
  