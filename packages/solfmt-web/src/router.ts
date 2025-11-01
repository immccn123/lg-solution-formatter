import Config from "./routes/Config.vue";
import Home from "./routes/Home.vue";
import {  createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/config", component: Config },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
