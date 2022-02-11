import axios from "axios";
import {AUTH_ERROR, AUTH_LOGOUT, AUTH_REQUEST, AUTH_SUCCESS} from "@/modules/auth-actions";
import {USER_REQUEST} from "@/modules/user-actions";

const state = {
    token: localStorage.getItem('user-token') || '',
    status: ''
}

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
}

const actions = {
    [AUTH_REQUEST]: ({commit, dispatch}, user) => {
        return new Promise((resolve, reject) => { // The Promise used for router redirect in login
            commit(AUTH_REQUEST)
            axios({url: '/api/auth/login', data: user, method: 'POST' })
                .then(resp => {
                    const token = resp.data.token
                    localStorage.setItem('user-token', token) // store the token in localstorage
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                    commit(AUTH_SUCCESS, token)
                    // you have your token, now log in your user :)
                    dispatch(USER_REQUEST)
                    resolve(resp)
                })
                .catch(err => {
                    commit(AUTH_ERROR, err)
                    localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
                    reject(err)
                })
        })
    },
    [AUTH_LOGOUT]: ({commit, dispatch}) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_LOGOUT)
            localStorage.removeItem('user-token') // clear your user's token from localstorage
            delete axios.defaults.headers.common['Authorization']
            resolve()
        })
    }
}


const mutations = {
    [AUTH_REQUEST]: (state) => {
        state.status = 'loading'
    },
    [AUTH_SUCCESS]: (state, token) => {
        state.status = 'success'
        state.token = token
    },
    [AUTH_ERROR]: (state) => {
        state.status = 'error'
    },
}

export default {getters, state, actions, mutations }

