import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: 0
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
