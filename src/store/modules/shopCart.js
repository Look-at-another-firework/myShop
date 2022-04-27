// 用户信息模块
const state = {
  shoppingCart: []
}
const mutations = {
  ADDSHOPCART(state, data) {
    // 添加购物车
    // 用于在商品详情页点击添加购物车,后台添加成功后，更新vuex状态
    state.shoppingCart.unshift(data)
  },
  addShopCartNum(state, id) {
    // 增加购物车商品数量
    // 用于在商品详情页点击添加购物车,后台返回002，“该商品已在购物车，数量 +1”，更新vuex的商品数量
    for (let i = 0; i < state.shoppingCart.length; i++) {
      const temp = state.shoppingCart[i]
      if (temp.productID == id) {
        temp.num++
      }
    }
  },
  CHANGECHECK(state, payload) {
    // 更新购物车
    // 可更新商品数量和是否勾选
    // 用于购物车点击勾选及加减商品数量
    if (payload.prop == 'num') {
      // 传入num，判断数量是否大于限购或者小于1
      if (state.shoppingCart[payload.key].maxNum < payload.val) {
        return
      }
      if (payload.val < 1) {
        return
      }
    }
    // 根据商品在购物车的数组的索引和属性更改
    state.shoppingCart[payload.key][payload.prop] = payload.val
  },
  CHECKALL(state, data) {
    // 全部选中
    state.shoppingCart.forEach((i) => {
      i.check = data
    })
  },
  DELETESHOPPINGCART(state, id) {
    for (let i = 0; i < state.shoppingCart.length; i++) {
      const temp = state.shoppingCart[i]
      if (temp.id == id) {
        state.shoppingCart.splice(i, 1)
      }
    }
  },
  SETSHOPPINGCART(state, data) {
    state.shoppingCart = data
  }
}
const actions = {
  // 添加购物车
  addShopCart({ commit }, data) {
    commit('ADDSHOPCART', data)
  },
  // 购物车数量加一
  addShopCartNum({ commit }, id) {
    commit('addShopCartNum', id)
  },
  changeCheck({ commit }, payload) {
    commit('CHANGECHECK', payload)
  },
  // 全选按钮
  checkAll({ commit }, data) {
    commit('CHECKALL', data)
  },
  // 删除
  deleteShoppingCart({ commit }, id) {
    commit('DELETESHOPPINGCART', id)
  },
  // 设置购物车状态
  setShoppingCart({ commit }, data) {
    commit('SETSHOPPINGCART', data)
  }
}

const getters = {
  // 购物车数量
  getNum(state) {
    // 购物车总数量
    let totalNum = 0
    for (let i = 0; i < state.shoppingCart.length; i++) {
      const temp = state.shoppingCart[i]
      totalNum += temp.num
    }
    return totalNum
  },
  // 获取购物车的状态
  getShoppingCart(state) {
    return state.shoppingCart
  },
  getCheckNum(state) {
    // 获取购物车勾选的商品数量
    let totalNum = 0
    state.shoppingCart.forEach((i) => {
      if (i.check) {
        totalNum += i.num
      }
    })
    return totalNum
  },
  getTotalPrice(state) {
    // 合计
    let totalPrice = 0
    state.shoppingCart.forEach((i) => {
      if (i.check) {
        totalPrice += i.price * i.num
      }
    })
    return totalPrice
  },
  // 全选
  getIsAllCheck(state) {
    let isAllCheck = null
    state.shoppingCart.every((i) => {
      i.check == true ? (isAllCheck = true) : (isAllCheck = false)
    })
    return isAllCheck
  },
  // 勾选的商品
  getCheckGoods(state) {
    let checkGoods = []
    state.shoppingCart.forEach((i) => {
      if (i.check) {
        checkGoods.push(i)
      }
    })
    return checkGoods
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
