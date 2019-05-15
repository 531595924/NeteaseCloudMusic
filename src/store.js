import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    userInfo: {}
  },
  mutations: {
    userInfo(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.userInfo = JSON.stringify(userInfo);
    }
  },
  actions: {

  }
})
