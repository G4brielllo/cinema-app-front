import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from './components/LoginPage.vue'; 
import RegisterPage from './components/RegisterPage.vue';

import AddMovie from './components/AddMovie.vue';
import HomePage from './components/HomePage.vue';
import MovieList from './components/MovieList.vue';
// import HelloWorld from './components/HelloWorld.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/addMovie',
    name: 'AddMovie',
    component: AddMovie
  },
  {
    path: '/movieList',
    name: 'MovieList',
    component: MovieList
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
