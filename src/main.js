import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import './assets/_global_style.scss'
import axios from "axios";
import Store from "@/store";


const token = localStorage.getItem('token')
if (token) {
    axios.defaults.headers.common['Authorization'] = token
}


createApp(App).use(router).use(Store).mount('#app')
