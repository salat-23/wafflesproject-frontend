import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from "vuex";
import './assets/_global_style.scss'
import {createStore} from "vuex";
import axios from "axios";
import authModule from "@/modules/auth.module";
import userModule from "@/modules/user.module";


const token = localStorage.getItem('user-token')
if (token) {
    axios.defaults.headers.common['Authorization'] = token
}

const store = new Vuex.Store({
    modules: {
        a: authModule,
        b: userModule
    }
});
createApp(App).use(router).use(store).mount('#app')

export default store