<template>
    <v-container class="d-flex justify-center align-center">
      <v-card width="50%">
        <v-card-title>
          <h1>Login</h1>
        </v-card-title>
        <v-text-field
          v-model="user.email"
          label="E-mail"
          placeholder="johndoe@gmail.com"
          clearable
          type="email"
        >
        </v-text-field>
        <v-text-field
          v-model="user.password"
          :type="showPassword ? 'text' : 'password'"
          label="Hasło"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="togglePassword"
          clearable
        >
        </v-text-field>
        <v-card-actions>
          <v-btn
            class="hover-btn"
            style="min-width: 150px"
            
            @click="login"
            >Zaloguj</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn
            class="hover-btn"
            style="min-width: 250px"
            
            @click="goToForgotPassword"
          >
            Zapomniałem hasła
          </v-btn>
        </v-card-actions>
        <v-card-text class="text-center">
          Nie masz konta?
          <v-btn
            class="text-blue no-uppercase"
            style="text-transform: none"
            variant="text"
            
            @click="goToRegister"
            >Zarejestruj się</v-btn
          >
        </v-card-text>
        
      </v-card>
    </v-container>
</template>

<script>
import Swal from "sweetalert2";
import {
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
        // this.showAlert();
        this.goToHomePage();
      } catch (error) {
        console.error("Login failed", error.response.data);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToHomePage() {
      // this.$router.push("/");
      window.location.href = "/";
    },
    goToForgotPassword() {
      this.$router.push("/forgot-password");
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    showAlert() {
      Swal.fire({
        icon: "success",
        title: "Dodano Seans",
        text: "alercik",
        animation: true,
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    },
  },
};
</script>

<style scoped>
.v-card-actions {
  display: flex;
  justify-content: center;
}
</style>
