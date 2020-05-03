import Axios from 'axios'
import { Message } from 'element-ui'

const tokenKey = 'nike#token'

const state = {
  username: '',
  token: localStorage.getItem(tokenKey) || '',
  loading: false,
  error: null
}

const getters = {
  isLogin (state) {
    return !!state.token
  }
}

const mutations = {
  DO_LOGIN (state) {
    state.loading = true
  },
  LOGIN (state, { username = '', token = '', error = null }) {
    state.loading = false
    state.username = username
    state.token = token
    state.error = error
  },
  LOGOUT (state) {
    state.username = ''
    state.token = ''
  }
}

const actions = {
  login ({ commit }, { username, password }) {
    commit('DO_LOGIN')
    return Axios.post('/sellerctr/login', {
      user_name: username,
      psw: password
    }).then(({ data }) => {
      const { token } = data.data
      localStorage.setItem(tokenKey, token)
      commit('LOGIN', { username, token })
    }).catch(error => {
      Message.error(`登录失败: ${error.message || '未知错误'}`)
      console.error(error)
      commit('LOGIN', { error })
    })
  },
  logout ({ commit }) {
    localStorage.removeItem(tokenKey)
    commit('LOGOUT')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
