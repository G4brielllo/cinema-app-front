<template>
  <v-app>
    <ToolbarNavigation/>
    <router-view/>
    <!-- <v-footer app>
      <v-col class="text-center">
        <span>&copy; 2023 Movie Booking System</span>
      </v-col>
    </v-footer> -->
  </v-app>
  
</template>

<script>
import ToolbarNavigation from './components/ToolbarNavigation.vue';
export default {
  components: {
    ToolbarNavigation,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
