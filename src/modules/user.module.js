import {USER_ERROR, USER_REQUEST, USER_SUCCESS} from "@/modules/user-actions";
import {AUTH_LOGOUT} from "@/modules/auth-actions";
import axios from "axios";
import Vue from "core-js/internals/task";

const state = { status: "", profile: {} };

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name
};

const actions = {
    [USER_REQUEST]: ({ commit, dispatch }) => {
        commit(USER_REQUEST);
        axios.get('/api/users/me')
            .then(resp => {
                commit(USER_SUCCESS, resp);
            })
            .catch(() => {
                commit(USER_ERROR);
                // if resp is unauthorized, logout, to
                dispatch(AUTH_LOGOUT);
            });
    }
};

const mutations = {
    [USER_REQUEST]: state => {
        state.status = "loading";
    },
    [USER_SUCCESS]: (state, resp) => {
        state.status = "success";
        Vue.set(state, "profile", resp);
    },
    [USER_ERROR]: state => {
        state.status = "error";
    },
    [AUTH_LOGOUT]: state => {
        state.profile = {};
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};