import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import BillingForm from './views/BillingForm.vue'
import Orderview from './views/Orderview.vue'
import Addnewcategory from './views/Addnewcategory.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/billingForm',
      name: 'billingForm',
      component: BillingForm
    },
    {
      path: '/orderview',
      name: 'orderview',
      component: Orderview
    },
    {
      path: '/addnewcategory',
      name: 'addnewcategory',
      component: Addnewcategory
    }
  ]
})
