import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCompositionApi from '@vue/composition-api'

import './plugins/elementUI'
import '../src/styles/reset.css'

Vue.config.productionTip = false;

Vue.use(VueCompositionApi)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
