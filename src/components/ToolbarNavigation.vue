<template>
  <v-toolbar color="primary" dark density="comfortable">
    <v-btn v-if="isAdmin" icon @click="$emit('update:modelValue', !modelValue)">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-toolbar-title class="ml-2 cursor-pointer" @click="goHomePage">
      CineManager
    </v-toolbar-title>

    <v-spacer />

    <div class="d-none d-md-flex align-center ga-1">
      <v-btn class="hover-btn" variant="text" @click="goToRepertoire"
        >Repertuar</v-btn
      >
      <v-btn class="hover-btn" variant="text" @click="goToAnnouncements"
        >Zapowiedzi</v-btn
      >
      <v-btn class="hover-btn" variant="text" @click="goToSchoolPage"
        >Szkoła</v-btn
      >
      <v-btn class="hover-btn" variant="text" @click="navigate('/contactPage')"
        >Kontakt</v-btn
      >
      <v-btn class="hover-btn" variant="text" @click="navigate('/aboutUsPage')"
        >O nas</v-btn
      >

      <v-menu v-if="isLogged" location="bottom">
        <template #activator="{ props }">
          <v-btn class="hover-btn" icon v-bind="props">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in userActions"
            :key="index"
            @click="item.route === '/logout' ? logout() : navigate(item.route)"
          >
            <template #prepend>
              <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn icon v-if="!isLogged" @click="navigate('/login')">
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </div>

    <div class="d-flex d-md-none">
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="goToRepertoire">
            <v-list-item-title>Repertuar</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goToAnnouncements">
            <v-list-item-title>Zapowiedzi</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goToSchoolPage">
            <v-list-item-title>Szkoła</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigate('/contactPage')">
            <v-list-item-title>Kontakt</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigate('/aboutUsPage')">
            <v-list-item-title>O nas</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <template v-if="isLogged">
            <v-list-item
              v-for="(item, index) in userActions"
              :key="index"
              @click="
                item.route === '/logout' ? logout() : navigate(item.route)
              "
            >
              <template #prepend>
                <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item v-if="!isLogged" @click="navigate('/login')">
            <v-icon start>mdi-login</v-icon>
            <v-list-item-title>Zaloguj</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { VIcon, VBtn } from "vuetify/lib/components";

export default {
  components: {
    VIcon,
    VBtn,
  },
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
        { title: "Moje Konto", icon: "mdi-account", route: "/userDashboard" },
        { title: "Wyloguj", icon: "mdi-logout", route: "/logout" },
      ],
      isLogged: false,
      isAdmin: false,
    };
  },
  created() {
    this.checkAdminRole();
    this.isLoggedIn();
    setInterval(this.callReservationCleanup, 3 * 60 * 1000);
    setInterval(this.autoArchive, 30 * 60 * 1000);
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
    async autoArchive() {
      try {
        await axios.get("http://localhost:8000/api/auto-archive-movies");
        await axios.get("http://localhost:8000/api/auto-archive-screenings");
        await axios.get("http://localhost:8000/api/auto-archive-movies");
      } catch (error) {
        console.error("Nie udało się zarchiwizować filmów oraz seansów", error);
      }
    },
  },
};
</script>
<style scoped>
.no-rounded .v-btn {
  border-radius: 0 !important;
}
</style>
