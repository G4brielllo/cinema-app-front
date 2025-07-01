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
import Swal from "sweetalert2";
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
        this.showAlert("reset_link_sent");
      } catch (e) {
        this.showAlert("reset_link_error");
      }
    },
    showAlert(status) {
      if (status === "reset_link_sent") {
        Swal.fire({
          title: "Link resetujący został wysłany",
          text: "Sprawdź swoją skrzynkę mailową!",
          icon: "success",
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Błąd",
          text: "Nie udało się wysłać linku resetującego",
          icon: "warning",
          showConfirmButton: false,
        });
      }
    },
  },
};
</script>
