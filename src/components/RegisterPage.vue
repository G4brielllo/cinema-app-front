<template>
    <v-container class="d-flex justify-center align-center">
      <v-card width="50%">
        <v-card-title>
          <h1>Rejestracja</h1>
        </v-card-title>
        <v-text-field v-model="user.name" label="Imię"> </v-text-field>
        <v-text-field v-model="user.surname" label="Nazwisko"> </v-text-field>
        <v-text-field
          v-model="user.email"
          label="E-mail"
          placeholder="johndoe@gmail.com"
          clearable
        >
        </v-text-field>
        <v-text-field v-model="user.password" label="Hasło"> </v-text-field>
        <v-text-field
          v-model="user.password_confirmation"
          label="Powtórz hasło"
        >
        </v-text-field>
        <v-card-actions>
          <v-btn class="hover-btn" style="min-width: 170px"  @click="saveUser()">Zarejestruj się</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn class="hover-btn md-12" style="min-width: 150px"  @click="goToLogin">Zaloguj się</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
</template>

<script>
import {
  VContainer,
  VCard,
  VTextField,
  VBtn,
  VCardActions,
} from "vuetify/lib/components";
import axios from "axios";
export default {
  components: {
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
      this.$router.push("/login");
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
