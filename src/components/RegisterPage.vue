<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card title="Rejestracja" variant="tonal" width="50%">
        <v-text-field v-model="user.name" label="Imię" variant="outlined">
        </v-text-field>
        <v-text-field
          v-model="user.surname"
          label="Nazwisko"
          variant="outlined"
        >
        </v-text-field>
        <v-text-field v-model="user.email" label="E-mail" variant="outlined"
        placeholder="johndoe@gmail.com" clearable>
        </v-text-field>
        <v-text-field v-model="user.password" label="Hasło" variant="outlined">
        </v-text-field>
        <v-text-field
          v-model="user.password_confirmation"
          label="Powtórz hasło"
          variant="outlined"
        >
        </v-text-field>
        <v-card-actions>
          <v-btn @click="saveUser()" style="outline: auto"
            >Zarejestruj się</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn @click="goToLogin" style="outline: auto">Zaloguj się</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import {
  VApp,
  VContainer,
  VCard,
  VTextField,
  VBtn,
  VCardActions,
} from "vuetify/lib/components";
import axios from "axios";
export default {
  components: {
    VApp,
    VContainer,
    VCard,
    VTextField,
    VBtn,
    VCardActions,
  },
  data() {
    return {
      user: {
        name: "",
        surname: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
    };
  },
  methods: {
    async saveUser() {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/register",
          this.user
        );
        console.log(response.data);
        this.goToLogin();
      } catch (error) {
        console.error(error);
      }
    },
    goToLogin() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
.v-card-actions {
  display: flex;
  justify-content: center;
}
</style>
