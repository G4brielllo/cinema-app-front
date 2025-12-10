<template>
  <v-container class="py-16">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="" variant="tonnal">
          <v-card-title class="text-start text-primary">
            <h2>Skontaktuj się z nami</h2>
          </v-card-title>

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
              variant="underlined"
              label="Wiadomość"
              prepend-icon="mdi-comment"
              auto-grow
              rows="4"
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
              <v-col cols="12" lg="4" class="text-center">
                <v-icon color="primary">mdi-map-marker</v-icon>
                <div class="mt-4">
                  <div class="text-subtitle-1 font-weight-bold">
                    ul. Kinowa 12, 00-123 Warszawa
                  </div>
                </div>
              </v-col>

              <v-col cols="12" lg="4" class="text-center">
                <v-icon color="primary">mdi-phone</v-icon>
                <div class="mt-4">
                  <div class="text-subtitle-1 font-weight-bold text-no-wrap">
                    +48 123 456 789
                  </div>
                </div>
              </v-col>

              <v-col cols="12" lg="4" class="text-center">
                <v-icon color="primary">mdi-email</v-icon>
                <div class="mt-4">
                  <div class="text-subtitle-1 font-weight-bold text-no-wrap">
                    support@cinemanager.pl
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
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
