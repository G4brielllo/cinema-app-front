<template>
  
  <v-app>
      <v-container class="d-flex justify-center align-center">
        <v-card title="Login" variant="tonal" width="50%">
          <v-text-field v-model="user.email" label="E-mail" variant="outlined"> </v-text-field>
          <v-text-field v-model="user.password" label="Hasło" variant="outlined"> </v-text-field>
          <v-card-actions>
            <v-btn @click="login" style="outline: auto">Zaloguj</v-btn>
          </v-card-actions>
          <v-card-text> Nie masz konta? </v-card-text>
          <v-card-actions>
            <v-btn @click="goToRegister" style="outline: auto">Zarejestruj się</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-app>
</template>

<script>
import { VApp, VContainer, VCard, VTextField, VBtn, VCardActions, VCardText} from 'vuetify/lib/components';
import axios from 'axios';
export default {
  components: {
    VApp,
    VContainer,
    VCard,
    VTextField,
    VBtn,
    VCardActions,
    VCardText
  },
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8000/api/login', this.user);
        console.log(response.data);
        localStorage.setItem('access_token', response.data.access_token);
        console.log("Login successful", response.data);
        this.goToHomePage();
        // Handle successful login (e.g., redirect to dashboard)
      } catch (error) {
        console.error("Login failed", error.response.data);
        // Handle error (e.g., show error message)
      }
    },
    goToRegister() {
      this.$router.push('/register');
    },
    goToHomePage() {
      this.$router.push('/');
    }
  }
};
</script>

<style>
.v-card-actions {
  display: flex;
  justify-content: center;
}</style>
