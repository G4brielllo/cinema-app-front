<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card width="50%">
        <v-card-title>
          <h1>Login</h1>
        </v-card-title>
        <v-text-field
          v-model="user.email"
          label="E-mail"
          variant="outlined"
          placeholder="johndoe@gmail.com"
          clearable
          type="email"
        >
        </v-text-field>
        <v-text-field
          v-model="user.password"
          :type="showPassword ? 'text' : 'password'"
          label="Hasło"
          variant="outlined"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="togglePassword"
          clearable
        >
        </v-text-field>
        <v-card-actions>
          <v-btn @click="login" style="outline: auto">Zaloguj</v-btn>
        </v-card-actions>
        <v-card-text> Nie masz konta? </v-card-text>
        <v-card-actions>
          <v-btn @click="goToRegister" style="outline: auto"
            >Zarejestruj się</v-btn
          >
        </v-card-actions>
        <!-- <v-card-text> Zapomniałem hasła </v-card-text> -->
        <v-card-actions>
          <v-btn variant= "text" @click="goToForgotPassword" style="outline: auto">
            Zapomniałem hasła
          </v-btn>
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
  VCardText,
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
    VCardText,
  },
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      showPassword: false,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/login",
          this.user
        );
        console.log(response.data);
        localStorage.setItem("access_token", response.data.access_token);
        console.log("Login successful", response.data);
        this.goToHomePage();
      } catch (error) {
        console.error("Login failed", error.response.data);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToHomePage() {
      this.$router.push("/");
    },
    goToForgotPassword() {
      this.$router.push("/forgot-password");
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
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
