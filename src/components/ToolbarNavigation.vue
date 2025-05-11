<template>
  <v-toolbar title="CineManager">
    <v-toolbar-items class="ml-auto">
      <div class="d-flex ga-1">
        <v-label @click="goToRepertoire">Repertuar</v-label>
        <v-spacer></v-spacer>
        <v-label>Cennik</v-label>
        <v-spacer></v-spacer>
        <v-label>Kontakt</v-label>
        <v-spacer></v-spacer>
        <v-label>O nas</v-label>
        <v-spacer></v-spacer>
        <v-btn color="primary">
          <v-icon icon="mdi-menu"></v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-list-item
              @click="navigate(item.route)"
                v-for="(item, index) in items"
                :key="index"
                :value="index"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

        <!-- <v-btn @click="openAdminPanel">
          <v-icon icon="mdi-menu"></v-icon>
        </v-btn> -->
        <v-btn @click="goHomePage">
          <v-icon icon="mdi-home"></v-icon>
        </v-btn>
        <v-btn @click="goToLogin">
          <v-icon icon="mdi-account"></v-icon>
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

export default {
  components: {
    VToolbar,
    VBtn,
    VIcon,
    VToolbarItems,
  },
  data() {
    return {
      items: [
        { title: "Dodaj Film", route: "/addMovie" },
        { title: "Lista Filmów", route: "/moviesList" },
        { title: "Dodaj Seans", route: "/addMovieScreening" },
        { title: "Lista Seansów", route: "/screeningsList" },
        { title: "Lista Użytkowników", route: "/usersList" },
      ],
      
    };
  },
  methods: {
    navigate(route){
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
    openAdminPanel() {},
    async logout() {
      localStorage.removeItem("access_token");
      console.log("Logout successful");
      this.$router.push("/login");
    },
  },
};
</script>
