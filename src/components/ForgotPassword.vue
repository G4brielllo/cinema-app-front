<template>
  <v-container class="d-flex justify-center align-center">
    <v-card width="50%">
      <v-card-title>
        <h1>Zapomniałem Hasła</h1>
      </v-card-title>
      <v-form @submit.prevent="sendResetEmail">
        <v-text-field v-model="email" label="Email" required />
        <v-btn type="submit">Wyślij link resetujący</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { VContainer, VTextField, VBtn } from "vuetify/lib/components";
export default {
  data() {
    return { email: "" };
  },
  components: {
    VContainer,
    VTextField,
    VBtn,
  },
  methods: {
    async sendResetEmail() {
      try {
        await axios.post("http://localhost:8000/api/forgot-password", {
          email: this.email,
        });
        alert("Wysłano link resetujący!");
      } catch (e) {
        alert("Nie udało się wysłać linku");
      }
    },
  },
};
</script>
