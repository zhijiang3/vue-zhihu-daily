import Vue from 'vue'
import axios from 'axios'
import App from './App'
import store from './store'
import router from './router'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
