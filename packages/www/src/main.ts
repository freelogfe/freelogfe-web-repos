import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/index.scss";
import lazyPlugin from "vue3-lazy";

createApp(App).use(store).use(router).use(lazyPlugin, {}).mount("#app");
