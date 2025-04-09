<template>
  <v-toolbar title="Toolbar" :collapse="collapse">
    <v-toolbar-items class="ml-auto">
      <div class="d-flex ga-1">
        <v-label>Repertuar</v-label>
        <v-spacer></v-spacer>
        <v-label>Cennik</v-label>
        <v-spacer></v-spacer>
        <v-label>Kontakt</v-label>
        <v-spacer></v-spacer>
        <v-label>O nas</v-label>
        <v-spacer></v-spacer>
        <v-btn icon @click="collapse = !collapse">
          <v-icon icon="mdi-menu"></v-icon>
        </v-btn>
        <v-btn icon @click="goHome">
          <v-icon icon="mdi-home"></v-icon>
        </v-btn>
        <v-btn icon @click="goToLogin">
          <v-icon icon="mdi-account"></v-icon>
        </v-btn>
        <v-btn icon @click="logout">
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
    goToLogin() {
      this.$router.push("/login");
    },
    goToRegister() {
      this.$router.push("/register");
    },
    async logout() {
      localStorage.removeItem("access_token");
      console.log("Logout successful");
      this.$router.push("/login");
    },
  },
};
</script>
