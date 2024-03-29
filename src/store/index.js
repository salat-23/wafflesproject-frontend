
import Vuex from 'vuex'
import axios from 'axios'

const localStorageRole = 'role'

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {}
    },


    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, payload) {
            state.status = 'success'
            state.token = payload.token
            state.user = payload.user
        },
        signup_error(state) {
          state.status = 'exists'
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.token = ''
        },
    },
    actions: {
        // ...

        login({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({ url: '/api/auth/signin', data: user, method: 'POST' })
                    .then(resp => {
                        const token = resp.data.accessToken
                        const user = {
                            username: resp.data.username,
                            roles: resp.data.roles
                        }

                        localStorage.setItem('token', token)
                        axios.defaults.headers.common['Authorization'] = token

                        axios.get('/api/users/me')
                            .then(meResp => {
                                localStorage.setItem(localStorageRole, meResp.data.role)
                            })
                        commit('auth_success', { token: token, user: user })
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('token')
                        localStorage.removeItem(localStorageRole)
                        reject(err)
                    })
            })
        },
        register({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({ url: '/api/auth/signup', data: user, method: 'POST' })
                    .then(resp => {
                        if (resp.status !== 200) {
                            commit('signup_error')
                        }
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('token')
                        localStorage.removeItem(localStorageRole)
                        reject(err)
                    })
            })
        },
        logout({commit}) {
            return new Promise((resolve, reject) => {
                commit('logout')
                localStorage.removeItem('token')
                localStorage.removeItem(localStorageRole)
                delete axios.defaults.headers.common['Authorization']
                resolve()
            })
        }
    },
    modules: {

    }

})
