import { createStore } from 'vuex';
import Vuex from 'vuex';
import auth from './auth';
import axios from 'axios';
import VueCookies from 'vue-cookies';

const store = createStore({
  modules: {
    auth,
  },
  state: {
    user: null,
    token: null,
  },
  mutations: {
    // Mutations to update the state
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    clearUser(state) {
      state.user = null;
    },
    clearToken(state) {
      state.token = null;
    },
  },
  actions: {
    // Actions for login and logout
    login({ commit }, { user, token }) {
      commit('setUser', user);
      commit('setToken', token);

        // Set the token in Axios headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Set a cookie to remember the login status
      VueCookies.set('setToken', token, '7d'); // Expires in 7 days
    },
    logout({ commit }) {
      commit('clearUser');
      commit('clearToken');

        // Remove the token from Axios headers
      delete axios.defaults.headers.common['Authorization'];

        // Delete the cookie on logout
      VueCookies.remove('setToken');
    },
  },
  getters: {
    // Getters for checking authentication status
    isAuthenticated: state => !!state.token,
  },
});

export default store;

