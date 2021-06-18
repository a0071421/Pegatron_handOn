import Vue from "vue";
import App from "./App.vue";
import "bootstrap";
import axios from "axios";
import VueAxios from "vue-axios";
import UUID from "vue-uuid";

Vue.use(UUID);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
