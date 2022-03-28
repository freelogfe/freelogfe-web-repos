import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/index.scss";
import lazyPlugin from "vue3-lazy";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App).use(store).use(router).use(lazyPlugin, {}).use(ElementPlus).mount("#app");
