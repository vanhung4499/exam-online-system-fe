import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import menu from './modules/menu'
import { trackPresence } from '@/api/user'
import { setToken } from '@/utils/auth'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isUserLoggedIn: false,
    heartbeatIntervalId: null
  },
  mutations: {
    setUserLoggedIn(state, value) {
      state.isUserLoggedIn = value
      if (value && !state.heartbeatIntervalId) {
        this.dispatch('sendHeartbeat')
        state.heartbeatIntervalId = setInterval(() => {
          // Trigger sending heartbeat action here
          this.dispatch('sendHeartbeat')
        }, 300000) // Send heartbeat every 5 minutes
      } else if (!value && state.heartbeatIntervalId) {
        clearInterval(state.heartbeatIntervalId)
        state.heartbeatIntervalId = null
      }
    }
  },

  actions: {
    sendHeartbeat({ commit, state }) {
      // Send heartbeat request to the backend
      trackPresence({ userId: state.userId }).then(response => {
        if (response.code) {
          setToken(response.data)
        }
      })
        .catch(error => {
          console.error('Failed to send heartbeat:', error)
        })
    },
    loginUser({ commit }, userData) {
      // Login logic, here simplified, actual auth request should be included
      // Assume setting user auth status after successful auth
      commit('setUserLoggedIn', true)
      // Set user ID to state, adjust the way of obtaining according to actual situation
      commit('setUserId', userData.id)
    },
    logoutUser({ commit }) {
      commit('setUserLoggedIn', false)
    }
  },
  getters: {
    isLoggedIn: state => state.isUserLoggedIn
  },
  modules: {
    app,
    settings,
    user,
    menu
  },
  getters
})

export default store
