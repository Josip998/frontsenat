const state = {
    user: null,
    token: null,
  };
  
  const mutations = {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
  };
  
  const actions = {
    login({ commit }, { user, token }) {
      commit('setUser', user);
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('setUser', null);
      commit('setToken', null);
    },
  };
  
  const getters = {
    // Define other getters specific to the `auth` module here if needed.
    getUser: (state) => state.user,
  };
  
  export default {
    state,
    mutations,
    actions,
    getters,
  };
  
  
  