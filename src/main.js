import 'es6-promise/auto';
import Vue from 'vue'
import 'assets/js/init.js'
import store from 'assets/js/store.js'
import router from 'assets/js/router.js'
import common from 'assets/js/common.js'
import App from './App'
//common.storeReady(function() {
  new Vue({
    store,
    el: '#app',
    template: '<App/>',
    components: {
      App
    },
    router
  }).$mount('#hengxing')
//})