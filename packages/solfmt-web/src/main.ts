import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia).mount("#app");
