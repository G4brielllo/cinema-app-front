import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "./components/LoginPage.vue";
import RegisterPage from "./components/RegisterPage.vue";

import AddMovie from "./components/AddMovie.vue";
import HomePage from "./components/HomePage.vue";
import MovieList from "./components/MovieList.vue";
import RepertoirePage from "./components/RepertoirePage.vue";
import AddMovieScreening from "./components/AddMovieScreening.vue";
import MovieBooking from "./components/MovieBooking.vue";
import ScreeningsList from "./components/ScreeningsList.vue";
import UsersList from "./components/UsersList.vue";
import ForgotPassword from "./components/ForgotPassword.vue";
import ResetPassword from "./components/ResetPassword.vue";
import CheckReeervation from "./components/CheckReservation.vue";
import UserDashboard from "./components/UserDashboard.vue";
import AnnouncementsPage from "./components/AnnouncementsPage.vue";
import PriceList from "./components/PriceList.vue";
import PaymentStatus from "./components/PaymentStatus.vue";
import HomePageManagement from "./components/HomePageManagement/HomePageManagement.vue";
import MainSlider from "./components/HomePageComponents/MainSlider.vue";
import SliderManager from "./components/HomePageManagement/SliderManager.vue";
import NowPlayingMovies from "./components/HomePageComponents/NowPlayingMovies.vue";
import AnnouncementsForHP from "./components/HomePageComponents/AnnouncementsForHP.vue";
import MovieDetails from "./components/MovieDetails.vue";
import SchoolPage from "./components/SchoolPage.vue";
import PromotionsPage from "./components/HomePageComponents/HPPromotionsPage.vue";
import PromotionsManagement from "./components/HomePageManagement/PromotionsManager.vue";
import AllPromotionsPage from "./components/AllPromotionsPage.vue";
import StatisticsPage from "./components/StatisticsPage.vue";
import UnauthorizedPage from "./components/UnauthorizedPage.vue";
import SeatingArrangement from "./components/HomePageManagement/SeatingArrangement.vue";
import HallList from "./components/HomePageManagement/HallList.vue";
// import HelloWorld from './components/HelloWorld.vue';

import { useUserStore } from "@/stores/user";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
    meta: { guest: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/addMovie",
    name: "AddMovie",
    component: AddMovie,
    meta: { roles: ["admin"] },
  },
  {
    path: "/moviesList",
    name: "MovieList",
    component: MovieList,
    meta: { roles: ["admin"] },
  },
  {
    path: "/repertoire",
    name: "Repertoire",
    component: RepertoirePage,
  },
  {
    path: "/addMovieScreening",
    name: "AddMovieScreening",
    component: AddMovieScreening,
    meta: { roles: ["admin"] },
  },
  {
    path: "/movieBooking",
    name: "MovieBooking",
    component: MovieBooking,
  },
  {
    path: "/screeningsList",
    name: "ScreeningsList",
    component: ScreeningsList,
    meta: { roles: ["admin"] },
  },
  {
    path: "/usersList",
    name: "UsersList",
    component: UsersList,
    meta: { roles: ["admin"] },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/checkReservation",
    name: "CheckReeservation",
    component: CheckReeervation,
    meta: { roles: ["admin"] },
  },
  {
    path: "/userDashboard",
    name: "UserDashboard",
    component: UserDashboard,
    meta: { roles: ["admin", "user"] },
  },
  {
    path: "/announcements",
    name: "AnnouncementsPage",
    component: AnnouncementsPage,
  },
  {
    path: "/priceList",
    name: "PriceList",
    component: PriceList,
  },
  {
    path: "/paymentStatus",
    name: "PaymentStatus",
    component: PaymentStatus,
  },
  {
    path: "/homePageManagement",
    name: "HomePageManagement",
    component: HomePageManagement,
    meta: { roles: ["admin"] },
  },
  {
    path: "/sliderManager",
    name: "SliderManager",
    component: SliderManager,
    meta: { roles: ["admin"] },
  },
  {
    path: "/mainSlider",
    name: "MainSlider",
    component: MainSlider,
  },
  {
    path: "/nowPlayingMovies",
    name: "NowPlayingMovies",
    component: NowPlayingMovies,
  },
  {
    path: "/announcementsForHP",
    name: "AnnouncementsForHP",
    component: AnnouncementsForHP,
  },
  {
    path: "/movieDetails",
    name: "MovieDetails",
    component: MovieDetails,
  },
  {
    path: "/schoolPage",
    name: "SchoolPage",
    component: SchoolPage,
  },
  {
    path: "/promotionsPage",
    name: "PromotionsPage",
    component: PromotionsPage,
  },
  {
    path: "/promotionsManagement",
    name: "PromotionsManagement",
    component: PromotionsManagement,
    meta: { roles: ["admin"] },
  },
  {
    path: "/allPromotionsPage",
    name: "AllPromotionsPage",
    component: AllPromotionsPage,
  },
  {
    path: "/statisticsPage",
    name: "StatisticsPage",
    component: StatisticsPage,
    meta: { roles: ["admin"] },
  },
  {
    path: "/unauthorizedPage",
    name: "UnauthorizedPage",
    component: UnauthorizedPage,
  },
  {
    path: "/seatingArrangement",
    name: "SeatingArrangement",
    component: SeatingArrangement,
  },
  {
    path: "/hallList",
    name: "HallList",
    component: HallList,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const role = userStore.user?.role;

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    return next("/unauthorizedPage");
  }
  next();
});
export default router;
