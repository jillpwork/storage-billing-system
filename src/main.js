import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import Vue2Filters from 'vue2-filters'
import VuePaginate from 'vue-pagination-2'
import JsonExcel from 'vue-json-excel'
import JqueryFileDownLoad from 'jquery-file-download'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.use(Vue2Filters)
Vue.use(VuePaginate)
Vue.use(JsonExcel)
Vue.use(JqueryFileDownLoad)
Vue.component('pagination', VuePaginate)
Vue.component('downloadExcel', JsonExcel)
Vue.config.productionTip = false

if (navigator.onLine) {

  var config = {
    apiKey: "_YOUR_API_KEY",
    authDomain: "_YOURAUTH_DOMAIN",
    databaseURL: "_YOURDB_URL",
    projectId: "_YOUR_PROJECTID",
    storageBucket: "_YOUR_STORAGE_BUCKET",
    messagingSenderId: "_YOURMESSENGERID"
  }
  firebase.initializeApp(config)
} else {
  alert('please check your network connection.')
}

new Vue({
  router,
  store,
  firebase,
  render: h => h(App)
}).$mount('#app')
