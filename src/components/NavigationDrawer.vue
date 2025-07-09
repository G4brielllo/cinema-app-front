<template>
  <v-navigation-drawer v-model="internalDrawer" temporary="true">
    <v-list>
      <v-list-item
        v-for="(item, i) in actionsForAdmin"
        :key="i"
        @click="navigate(item.route)"
      >
        <v-list-item-content class="d-flex align-center">
          <v-icon class="me-2">{{ item.icon }}</v-icon>
          <span>{{ item.title }}</span>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {
  VNavigationDrawer,
  VList,
  VListItem,
  VIcon,
} from "vuetify/lib/components";
export default {
  props: {
    modelValue: Boolean,
  },
  components: {
    VNavigationDrawer,
    VList,
    VListItem,
    VIcon,
  },

  emits: ["update:modelValue"],
  data() {
    return {
      actionsForAdmin: [
        {
          title: "Dodaj Film/Zapowiedź",
          route: "/addMovie",
          icon: "mdi-movie-plus",
        },
        {
          title: "Dodaj Seans",
          route: "/addMovieScreening",
          icon: "mdi-filmstrip",
        },
        {
          title: "Lista Filmów/Zapowiedzi",
          route: "/moviesList",
          icon: "mdi-format-list-bulleted",
        },
        {
          title: "Lista Seansów",
          route: "/screeningsList",
          icon: "mdi-format-list-bulleted",
        },
        {
          title: "Lista Użytkowników",
          route: "/usersList",
          icon: "mdi-account-group",
        },
        {
          title: "Zarządzaj Stroną Główną",
          route: "/homePageManagement",
          icon: "mdi-home",
        },
        {
          title: "Zweryfikuj Rezerwację",
          route: "/checkReservation",
          icon: "mdi-key",
        },
      ],
      internalDrawer: false,
    };
  },
  watch: {
    modelValue(newVal) {
      this.internalDrawer = newVal;
    },
    internalDrawer(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
  created() {
    this.internalDrawer = this.modelValue;
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
      this.internalDrawer = false;
    },
  },
};
</script>
