<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-center">
            <h1>Login</h1>
          </v-card-title>

          <v-card-text class="d-flex flex-column gap-4">
            <v-text-field
              v-model="user.email"
              label="E-mail"
              placeholder="johndoe@gmail.com"
              clearable
              type="email"
              dense
              outlined
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              :type="showPassword ? 'text' : 'password'"
              label="Hasło"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePassword"
              clearable
              dense
              outlined
            ></v-text-field>

            <v-btn class="hover-btn mb-2" block @click="login">
              Zaloguj
            </v-btn>
            <v-btn class="mb-2" color="secondary" outlined block @click="goToForgotPassword">
              Zapomniałem hasła
            </v-btn>

            <div class="text-center mt-4">
              Nie masz konta?
              <v-btn
                class="text-blue no-uppercase"
                style="text-transform: none"
                variant="text"
                @click="goToRegister"
              >
                Zarejestruj się
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>



<script>
import Swal from "sweetalert2";
import {
  VContainer,
  VCard,
  VTextField,
  VBtn,
  VCardText,
} from "vuetify/lib/components";
import axios from "axios";
export default {
  components: {
    VContainer,
    VCard,
    VTextField,
    VBtn,
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
