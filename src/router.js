import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from './components/LoginPage.vue'; 
import RegisterPage from './components/RegisterPage.vue';
// import HelloWorld from './components/HelloWorld.vue';

const routes = [
  // {
  //   path: '/',
  //   name: 'HelloWorld',
  //   component: HelloWorld
  // },
  {
    path: '/',
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
