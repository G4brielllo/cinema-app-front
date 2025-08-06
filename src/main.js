import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "vuetify/styles";
import router from "./router";
import vuetify from './plugins/vuetify'

const pinia = createPinia();

createApp(App)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .mount("#app");