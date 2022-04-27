// 用户信息模块
const state = {
  user: '', // 登录的用户
  showLogin: false // 是否显示登录组件
}
const mutations = {
  SETSHOWLOGIN(state, data) {
    state.showLogin = data
  },
  SETUSER(state, data) {
    state.user = data
  }
}
const actions = {
  setShowLogin({ commit }, data) {
    commit('SETSHOWLOGIN', data)
  },
  setUser({ commit }, data) {
    commit('SETUSER', data)
  }
}
const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
