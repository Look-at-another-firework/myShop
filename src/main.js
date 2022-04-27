import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局引入ele
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 引入api请求接口
import API from '../src/api'

Vue.prototype.$API = API

// 全局过滤器
// 补零
Vue.filter('timer', (timer) => {
  let time = new Date(timer)
  function timeAdd0(str) {
    if (str < 10) {
      str = '0' + str
    }
    return str
  }
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s)
})

// 全局组件
import myLogin from './components/myLogin.vue'
Vue.component('myLogin', myLogin)
import myRegister from './components/myRegister.vue'
Vue.component('myRegister', myRegister)
import myList from './components/myList.vue'
Vue.component('myList', myList)
import myMenu from './components/myMenu.vue'
Vue.component('myMenu', myMenu)

// 全局拦截器
router.beforeResolve((to, from, next) => {
  // 用户信息
  const User = store.state.user.user
  // 查看路由元信息是否有验证
  if (to.meta.requireAuth) {
    if (!User) {
      // 没有登录
      store.dispatch('user/setShowLogin', true)
      if (from.name == null) {
        //此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
        next('/')
        return
      }
      // 终止导航
      next(false)
      return
    }
  }
  next()
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
