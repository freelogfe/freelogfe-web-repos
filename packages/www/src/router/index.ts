import { judgeDevice } from "@/utils/utils";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const inMobile = judgeDevice();

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => (inMobile ? import("../views/mobile/home-mobile.vue") : import("../views/pc/home.vue")),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
