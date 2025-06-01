<template>
  <v-toolbar title="CineManager">
    <v-toolbar-items class="ml-auto">
      <div class="d-flex ga-1">
        <v-label @click="goToRepertoire">Repertuar</v-label>
        <v-spacer></v-spacer>
        <v-label @click="goToAnnouncements">Zapowiedzi</v-label>
        <v-spacer></v-spacer>
        <v-label @click="goToPriceList">Cennik</v-label>
        <v-spacer></v-spacer>
        <v-label>Kontakt</v-label>
        <v-spacer></v-spacer>
        <v-label>O nas</v-label>
        <v-spacer></v-spacer>
        <v-btn v-if="isAdmin" color="primary">
          <v-icon icon="mdi-menu"></v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-list-item
                @click="navigate(item.route)"
                v-for="(item, index) in actionsForAdmin"
                :key="index"
                :value="index"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

        <v-btn @click="goHomePage">
          <v-icon icon="mdi-home"></v-icon>
        </v-btn>

        <v-btn v-if="isLogged">
          <v-icon icon="mdi-account"></v-icon>

          <v-menu activator="parent" open-on-click>
            <v-list>
              <v-list-item
                v-for="(item, index) in userActions"
                :key="index"
                @click="
                  item.route === '/logout' ? logout() : navigate(item.route)
                "
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

        <v-btn @click="logout">
          <v-icon icon="mdi-logout"></v-icon>
        </v-btn>
      </div>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { VToolbar, VBtn, VIcon, VToolbarItems } from "vuetify/lib/components";
import "@mdi/font/css/materialdesignicons.css";
import axios from "axios";
export default {
  components: {
    VToolbar,
    VBtn,
    VIcon,
    VToolbarItems,
  },
  data() {
    return {
      actionsForAdmin: [
        { title: "Dodaj Film/Zapowiedź", route: "/addMovie" },
        { title: "Lista Filmów", route: "/moviesList" },
        { title: "Dodaj Seans", route: "/addMovieScreening" },
        { title: "Lista Seansów", route: "/screeningsList" },
        { title: "Lista Użytkowników", route: "/usersList" },
        { title: "Zweryfikuj Numer Rezerwacji", route: "/checkReservation" },
      ],
      userActions: [
        { title: "Moje Konto", route: "/userDashboard" },
        { title: "Wyloguj", route: "/logout" },
      ],
      isLogged: false,
      isAdmin: false,
    };
  },
  created() {
    this.checkAdminRole();
    this.isLoggedIn();
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
    },
    goHomePage() {
      this.$router.push("/");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToRepertoire() {
      this.$router.push("/repertoire");
    },
    goToDeleteMovie() {
      this.$router.push("/addMovie");
    },
    goToAnnouncements() {
      this.$router.push("/announcements");
    },
    goToPriceList() {
      this.$router.push("/priceList");
    },
    async checkAdminRole() {
      try {
        const response = await axios.get("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true,
        });
        this.isAdmin = response.data.role === "admin";
      } catch (error) {
        console.error("Błąd przy sprawdzaniu roli użytkownika:", error);
        this.isAdmin = false;
      }
    },
    isLoggedIn() {
      this.isLogged = !!localStorage.getItem("access_token");
    },
    async logout() {
      localStorage.removeItem("access_token");
      console.log("Logout successful");
      window.location.href = "/login";

      // this.$router.push("/login");
    },
  },
};
</script>
