// 引入
import Vue from 'vue'
import Router from 'vue-router'
// 使用
Vue.use(Router)

// 先把VueRouter原型对象的push，保存一份
let originPush = Router.prototype.push
let originReplace = Router.prototype.replace

// 重写push|replace
// 第一个参数：需要跳转的地址（传递哪些参数）
// 第二个参数：成功的回调
// 第三个参数：失败的回调
Router.prototype.push = function (location, res, rej) {
  if (res && rej) {
    originPush.call(this, location, res, rej)
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}
// 重写push|replace
// 第一个参数：需要跳转的地址（传递哪些参数）
// 第二个参数：成功的回调
// 第三个参数：失败的回调
Router.prototype.replace = function (location, res, rej) {
  if (res && rej) {
    originReplace.call(this, location, res, rej)
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}

const routes = [
  {
    path: '/',
    component: () => import('../view/Home.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../view/Home.vue')
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('../view/goods.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../view/about.vue')
  },
  {
    path: '/goods/details',
    name: 'Details',
    component: () => import('../view/details.vue')
  },
  {
    path: '/shopCart',
    name: 'ShopCart',
    component: () => import('../view/shopCart.vue')
  },
  {
    path: '/collect',
    name: 'Collect',
    component: () => import('../view/collect.vue'),
    meta: {
      requireAuth: true // 需要验证登录状态
    }
  },
  {
    path: '/confirmOrder',
    name: 'ConfirmOrder',
    component: () => import('../view/ConfirmOrder.vue'),
    meta: {
      requireAuth: true // 需要验证登录状态
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../view/order.vue'),
    meta: {
      requireAuth: true // 需要验证登录状态
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../components/Error.vue')
  }
]

const router = new Router({
  routes
})

export default router
