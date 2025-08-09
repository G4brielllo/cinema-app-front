<template>
  <v-container>
    <v-card variant="tonal" class="payment-success">
      <v-card-title class="text-h5">Payment Successful</v-card-title>
      <v-card-text>
        <p>Your payment has been processed successfully.</p>
        <p>Thank you for your purchase!</p>
      </v-card-text>
      <v-card-actions>
        <v-btn class="hover-btn" @click="$router.push('/')">Udaj się na strone główną</v-btn>
      </v-card-actions>

    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'PaymentSuccess'
}
</script>

<style scoped>
.payment-success {
  text-align: center;
  margin-top: 50px;
}
</style>
