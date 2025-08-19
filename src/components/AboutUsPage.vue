<template>
  <v-container class="pa-6" style="max-width: 800px; margin: auto;">
    <v-card elevation="6" class="pa-6 rounded-card">
      <v-card-title class="headline title" >
        O nas
      </v-card-title>

      <v-card-text class="description mb-8">
        CineManager to kompleksowy system zarządzania kinem, który pomaga
        właścicielom i operatorom kin w efektywnym prowadzeniu działalności.
        Nasza misja to dostarczanie narzędzi umożliwiających szybkie zarządzanie
        repertuarem, sprzedażą biletów oraz rezerwacjami, abyś mógł skupić się
        na tym, co najważniejsze – dostarczaniu niezapomnianych wrażeń kinowych.
      </v-card-text>

      <v-row dense>
        <v-col cols="12" md="4" class="text-center feature-col">
          <v-icon large color="#ffa600" class="feature-icon">mdi-speedometer</v-icon>
          <h3 class="feature-title">Szybkość</h3>
          <p class="feature-text">
            Intuicyjne narzędzia, które pozwalają zarządzać kinem szybko i bez komplikacji.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center feature-col">
          <v-icon large color="#ffa600" class="feature-icon">mdi-shield-check</v-icon>
          <h3 class="feature-title">Bezpieczeństwo</h3>
          <p class="feature-text">
            Dane Twoich klientów i rezerwacje są chronione zgodnie z najwyższymi standardami.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center feature-col">
          <v-icon large color="#ffa600" class="feature-icon">mdi-cogs</v-icon>
          <h3 class="feature-title">Automatyzacja</h3>
          <p class="feature-text">
            Automatyzujemy powtarzalne procesy, abyś mógł skupić się na rozwoju kina.
          </p>
        </v-col>
      </v-row>

      <v-card-actions class="justify-center mt-10">
        <v-btn class="hover-btn" @click="goToContact">
          Skontaktuj się z nami
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  methods: {
    goToContact() {
      this.$router.push("/contactPage");
    },
  },
};
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(64, 46, 50, 0.15);
  background-color: #fffdfa;
}

.title {
  color: #402e32;
  font-weight: 700;
  letter-spacing: 1.1px;
  font-size: 2.2rem;
  user-select: none;
}

.description {
  color: #402e32;
  font-size: 1.15rem;
  line-height: 1.7;
  font-weight: 400;
}

.feature-col {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 20px 15px;
  border-radius: 12px;
  cursor: default;
}

.feature-col:hover {
  background-color: #fff6dc;
  box-shadow: 0 12px 30px rgba(255, 166, 0, 0.25);
  transform: translateY(-6px);
}

.feature-icon {
  filter: drop-shadow(0 2px 3px rgba(255, 166, 0, 0.45));
  transition: transform 0.3s ease;
}

.feature-col:hover .feature-icon {
  transform: scale(1.2);
}

.feature-title {
  color: #402e32;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 12px;
  font-size: 1.25rem;
}

.feature-text {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.45;
}

</style>
