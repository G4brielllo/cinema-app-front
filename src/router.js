import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from './components/LoginPage.vue'; 
import RegisterPage from './components/RegisterPage.vue';

import AddMovie from './components/AddMovie.vue';
import HomePage from './components/HomePage.vue';
import MovieList from './components/MovieList.vue';
import RepertoirePage from './components/RepertoirePage.vue';
import AddMovieScreening from './components/AddMovieScreening.vue';
import MovieBooking from './components/MovieBooking.vue';
import ScreeningsList from './components/ScreeningsList.vue';
import UsersList from './components/UsersList.vue';
import ForgotPassword from './components/ForgotPassword.vue';
import ResetPassword from './components/ResetPassword.vue';
// import HelloWorld from './components/HelloWorld.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
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
  },
  {
    path: '/addMovie',
    name: 'AddMovie',
    component: AddMovie
  },
  {
    path: '/moviesList',
    name: 'MovieList',
    component: MovieList
  },
  {
    path: '/repertoire',
    name: 'Repertoire',
    component: RepertoirePage
  },
  {
    path: '/addMovieScreening',
    name: 'AddMovieScreening',
    component: AddMovieScreening
  },
  {
    path: '/movieBooking',
    name: 'MovieBooking',
    component: MovieBooking
  },
  {
    path: '/screeningsList',
    name: 'ScreeningsList',
    component: ScreeningsList
  },
  {
    path: '/usersList',
    name: 'UsersList',
    component: UsersList
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
