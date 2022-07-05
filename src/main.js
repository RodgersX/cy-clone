import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from "axios";

axios.defaults.withCredentials = false;
axios.defaults.baseURL = "https://api.open-meteo.com";

Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
