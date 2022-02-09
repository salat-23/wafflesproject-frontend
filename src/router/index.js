import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Watch from "@/views/Watch";
import Login from "@/views/Login";
import Register from "@/views/Register";

const routes = [
  /*{
    path: '/:catchAll(.*)',
    redirect: { name: 'Home' }
  },*/
  {
    path: '/github',
    beforeEnter(to, from, next) {
      window.location.replace("http://localhost:8080/api/login/oauth2/code/github")
    }
  },
  {
    path: '/auth',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
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
