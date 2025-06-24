<template>
  <v-app>
    <ToolbarNavigation />
    <router-view />
    <v-footer
      class="text-center d-flex flex-column ga-2 py-4"
      color="indigo-lighten-1"
    >
      <div class="d-flex ga-3">
        <v-btn
          v-for="icon in icons"
          :key="icon.name"
          :icon="icon.name"
          :href="icon.link"
          density="comfortable"
          variant="text"
        ></v-btn>
      </div>

      <v-divider class="my-2" thickness="2" width="50"></v-divider>

      <div
        class="text-caption font-weight-regular opacity-60 px-4"
        style="max-width: 800px; margin: 0 auto"
      >
        CineManager to kompleksowy system zarządzania kinem, stworzony z myślą o
        właścicielach i operatorach kin – zarówno pojedynczych, jak i
        sieciowych. Umożliwia pełną kontrolę nad repertuarem, salami, sprzedażą
        biletów, rezerwacjami i analizą danych. Dzięki intuicyjnemu
        interfejsowi, nowoczesnym funkcjom i automatyzacji procesów codzienne
        zarządzanie kinem staje się szybsze i bardziej efektywne. CineManager
        wspiera Twoje kino w rozwoju – od pierwszego seansu po setki projekcji
        miesięcznie.
      </div>

      <v-divider class="my-2"></v-divider>

      <div class="text-caption opacity-60">
        📧 Kontakt:
        <a
          href="mailto:support@cinemanager.pl"
          class="text-white text-decoration-underline"
          >support@cinemanager.pl</a
        >
        |
        <a href="#" class="text-white text-decoration-underline"
          >Polityka prywatności</a
        >
        |
        <a href="#" class="text-white text-decoration-underline">Regulamin</a>
      </div>

      <div class="mt-2">
        {{ new Date().getFullYear() }} — <strong>CineManager</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import ToolbarNavigation from "./components/ToolbarNavigation.vue";
import "@mdi/font/css/materialdesignicons.css";

export default {
  components: {
    ToolbarNavigation,
  },
  data() {
    return {
      icons: [
        { name: "mdi-facebook", link: "https://www.facebook.com/" },
        { name: "mdi-twitter", link: "https://x.com/" },
        { name: "mdi-linkedin", link: "https://www.linkedin.com/" },
        { name: "mdi-instagram", link: "https://www.instagram.com/" },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
