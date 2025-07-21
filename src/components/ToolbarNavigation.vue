<template>
  <v-toolbar>
    <v-btn v-if="isAdmin" icon @click="$emit('update:modelValue', !modelValue)">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-btn @click="goHomePage">
      <v-toolbar-title>CineManager</v-toolbar-title>
    </v-btn>

    <v-toolbar-items class="ml-auto">
      <div class="d-flex ga-1">
        <v-btn text @click="goToRepertoire">Repertuar</v-btn>
        <v-btn text @click="goToAnnouncements">Zapowiedzi</v-btn>
        <v-btn text @click="goToPriceList">Cennik</v-btn>
        <v-btn text @click="goToSchoolPage">Szkoła</v-btn>
        <v-btn text @click="navigate('/contact')">Kontakt</v-btn>
        <v-btn text @click="navigate('/about')">O nas</v-btn>
        <v-btn v-if="isLogged" icon>
          <v-icon>mdi-account</v-icon>
          <v-menu activator="parent">
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

        <v-btn v-if="isLogged" icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
        <v-btn v-if="!isLogged" icon @click="navigate('/login')">
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </div>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";
export default {
  props: {
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      actionsForAdmin: [
        { title: "Dodaj Film/Zapowiedź", route: "/addMovie" },
        { title: "Dodaj Seans", route: "/addMovieScreening" },
        { title: "Lista Filmów/Zapowiedzi", route: "/moviesList" },
        { title: "Lista Seansów", route: "/screeningsList" },
        { title: "Lista Użytkowników", route: "/usersList" },
        { title: "Zarządzaj Stroną Główną", route: "/homePageManagement" },
        { title: "Zweryfikuj Rezerwację", route: "/checkReservation" },
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
    setInterval(this.callReservationCleanup, 3 * 60 * 1000);
    setInterval(this.archiveMovies, 30 * 60 * 1000);
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
    },
    goHomePage() {
      this.$router.push("/");
    },
    goToRepertoire() {
      this.$router.push("/repertoire");
    },
    goToAnnouncements() {
      this.$router.push("/announcements");
    },
    goToPriceList() {
      this.$router.push("/priceList");
    },
    goToSchoolPage() {
      this.$router.push("/schoolPage");
    },
    isLoggedIn() {
      this.isLogged = !!localStorage.getItem("access_token");
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
        const userStore = useUserStore();
        userStore.setUser(response.data);
      } catch (error) {
        console.error("Błąd przy sprawdzaniu roli użytkownika:", error);
      }
    },
    async logout() {
      localStorage.removeItem("access_token");
      this.$router.push("/login").then(() => {
        window.location.reload();
      });
    },
    async callReservationCleanup() {
      try {
        await axios.get(
          "http://localhost:8000/api/delete-expired-reservations"
        );
      } catch (error) {
        console.error("Nie udało się wyczyścić rezerwacji:", error);
      }
    },
    async archiveMovies() {
      try {
        await axios.get("http://localhost:8000/api/auto-archive-movies");
      } catch (error) {
        console.error("Nie udało się zarchiwizować filmów:", error);
      }
    },
  },
};
</script>
