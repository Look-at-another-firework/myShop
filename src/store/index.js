// 用于汇总
import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user.js'
import shopCart from './modules/shopCart.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    user,
    shopCart
  }
})
