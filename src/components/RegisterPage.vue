<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h1>Rejestracja</h1>
          </v-card-title>

          <v-card-text class="d-flex flex-column gap-4">
            <v-text-field
              v-model="user.name"
              label="Imię"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              v-model="user.surname"
              label="Nazwisko"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              label="E-mail"
              placeholder="johndoe@gmail.com"
              clearable
              dense
              outlined
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              label="Hasło"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              v-model="user.password_confirmation"
              label="Powtórz hasło"
              dense
              outlined
            ></v-text-field>

            <!-- Przyciski w v-card-text z odstępem -->
            <v-btn class="mb-2" block color="primary" @click="saveUser()">Zarejestruj się</v-btn>
            <v-btn class="mb-2" block outlined color="secondary" @click="goToLogin">Zaloguj się</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { VContainer, VCard, VTextField, VBtn } from "vuetify/lib/components";
import axios from "axios";
export default {
  components: {
    VContainer,
    VCard,
    VTextField,
    VBtn,
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

<style scoped>
.v-card-actions {
  display: flex;
  justify-content: center;
}
</style>
