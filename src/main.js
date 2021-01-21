import Vue from 'vue';
import Vuex from 'vuex';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import HighchartsVue from 'highcharts-vue'

import App from './App.vue';
import categories from './store/modules/categories';
import costs from './store/modules/costs';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(HighchartsVue);

const store = new Vuex.Store({
  modules: {
    categories,
    costs
  }
});

const APP = new Vue({
  store,
  render: h => h(App),
})

store.dispatch('initCategoriesData').then(()=> {
  store.dispatch('initCostsData').then(()=> {
    APP.$mount('#app');
  })
});
