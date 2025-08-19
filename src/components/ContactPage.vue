<template>
  <v-container class="py-16">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-8" elevation="4">
          <v-card-title class="text-center text-primary">
            <h2>Skontaktuj się z nami</h2>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="submitForm" ref="contactForm">
              <v-text-field
                v-model="form.name"
                label="Imię i nazwisko"
                prepend-icon="mdi-account"
                required
              ></v-text-field>

              <v-text-field
                v-model="form.email"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                required
              ></v-text-field>

              <v-textarea
                v-model="form.message"
                label="Wiadomość"
                prepend-icon="mdi-message"
                auto-grow
                rows="4"
                class="textarea-fix"
                required
              ></v-textarea>

              <v-btn type="submit" class="hover-btn mt-4" block elevation="2">
                Wyślij
              </v-btn>
            </v-form>

            <v-divider class="my-6" color="primary"></v-divider>

            <div class="text-center">
              <h2 class="text-primary mb-4">Dane kontaktowe</h2>

              <v-row justify="center" class="mt-3">
                <v-col cols="12" md="4" class="text-center">
                  <v-icon color="primary">mdi-map-marker</v-icon>
                  <div class="mt-4">
                    <h4>ul. Kinowa 12, 00-123 Warszawa</h4>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <v-icon color="primary">mdi-phone</v-icon>
                  <div class="mt-4">
                    <h4 href="tel:+48123456789">+48 123 456 789</h4>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <v-icon color="primary">mdi-email</v-icon>
                  <div class="mt-4">
                    <h4 href="mailto:support@cinemanager.pl">
                      support@cinemanager.pl
                    </h4>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ContactPage",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    submitForm() {
      // Możesz tu dodać wysyłkę przez API
      console.log("Wiadomość wysłana:", this.form);
      this.$refs.contactForm.reset();
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
