<template>
  <v-app>
    <ToolbarNavigation/>
    <router-view/>
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
