<template>
    <v-container>
      <v-form @submit.prevent="resetPassword">
        <v-text-field v-model="email" label="Email" required />
        <v-text-field v-model="password" label="Nowe hasło" type="password" required />
        <v-text-field v-model="password_confirmation" label="Potwierdź hasło" type="password" required />
        <v-btn type="submit">Zresetuj hasło</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'
  import {
    VContainer,
    VTextField,
    VBtn,
    VForm,
  } from 'vuetify/lib/components'
  export default {
    data() {
      return {
        email: '',
        password: '',
        password_confirmation: '',
      }
    },
    components: {
      VContainer,
      VTextField,
      VBtn,
      VForm,
    },
    computed: {
      token() {
        return this.$route.query.token
      }
    },
    methods: {
      async resetPassword() {
        try {
          await axios.post('http://localhost:8000/api/reset-password', {
            token: this.token,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation
          })
          alert('Hasło zresetowane!')
          this.$router.push('/login')
        } catch (e) {
          alert('Nie udało się zresetować hasła')
        }
      }
    }
  }
  </script>
  