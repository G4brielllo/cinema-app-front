<template>
  <v-toolbar title="Toolbar" :collapse="collapse">
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
        <v-label @click="goToAddMovie">Dodaj Film</v-label>
        <v-spacer></v-spacer>
        <v-label @click="goToAddMovieScreening">Dodaj Seanse</v-label>
        <v-spacer></v-spacer>
        <v-label @click="goToMovieList">Lista Filmów</v-label>
        <v-spacer></v-spacer>
        <!-- <v-btn @click="collapse = !collapse"> -->
        <v-btn @click="openAdminPanel">
          <v-icon icon="mdi-menu"></v-icon>
        </v-btn>
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
      collapse: false,
    };
  },
  methods: {
    goHomePage() {
      this.$router.push("/");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToAddMovie() {
      this.$router.push("/addMovie");
    },
    goToMovieList() {
      this.$router.push("/movieList");
    },
    goToAddMovieScreening() {
      this.$router.push("/addMovieScreening");
    },
    goToRepertoire() {
      this.$router.push("/repertoire");
    },
    goToDeleteMovie() {
      this.$router.push("/addMovie");
    },
    openAdminPanel(){
      
    },
    async logout() {
      localStorage.removeItem("access_token");
      console.log("Logout successful");
      this.$router.push("/login");
    },
  },
};
</script>
