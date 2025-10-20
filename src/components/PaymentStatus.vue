<template>
  <v-container>
    <v-card elevation="6" class="payment-success pa-10 mb-10">
      <v-card-title class="text-h5 mb-4 text-center text-primary font-weight-bold">
        Płatność zakończona sukcesem
      </v-card-title>

      <v-card-text class="text-center">
        <p class="mb-2">Twoja płatność została pomyślnie przetworzona.</p>
        <p class="mb-6">
          Dziękujemy za zakup biletów w <span class="brand">CineManager</span>.
        </p>

        <v-divider class="my-6"></v-divider>

        <p class="text-body-2 text-grey-darken-1">
          Szczegóły transakcji znajdziesz w zakładce
          <strong>"Moje bilety"</strong> w Twoim profilu.
        </p>
      </v-card-text>

      <v-card-actions class="justify-center mt-6">
        <v-btn
          class="hover-btn px-8 py-4 text-subtitle-1 btn-center"
          size="large"
          rounded="xl"
          @click="$router.push('/userDashboard')"
        >
          Sprawdź swoje bilety
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "PaymentSuccess",
};
</script>

<style scoped>
.payment-success {
  text-align: center;
  margin-top: 80px;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff, #f7f5f5);
}

.brand {
  font-weight: 600;
  color: #402e32;
}

.btn-center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: none;
}
</style>
