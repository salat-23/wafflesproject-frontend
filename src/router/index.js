import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Watch from "@/views/Watch";
import Login from "@/views/Login";
import Register from "@/views/Register";
import store from "@/main";
import Account from "@/views/Account";


const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}


const routes = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'Home' }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:title',
    name: 'Watch',
    component: Watch
  },
  {
    path: '/:title/:episode',
    name: 'WatchEpisode',
    component: Watch
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
