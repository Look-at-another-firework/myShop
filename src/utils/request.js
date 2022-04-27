import axios from 'axios'

import router from '../router'

// 导入nprogress
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

import { Message } from 'element-ui'

const service = axios.create({
  // baseURL: 'http://101.132.181.9:3000/',
  timeout: 5000,
  withCredentials: false // 表示跨域请求时是否需要使用凭证
})

// 设置请求拦截器
service.interceptors.request.use(
  (confirm) => {
    // 进度条开始动
    nprogress.start()
    return confirm
  },
  (error) => {
    console.log(error)
    // 跳转error页面
    router.push({ path: '/error' })
    return Promise.reject(error)
  }
)

// 设置响应拦截器
service.interceptors.response.use(
  (response) => {
    // 进度条结束
    nprogress.done()
    return response.data
  },
  (error) => {
    // 跳转error页面
    router.push({ path: '/error' })
    console.log('响应出错啦' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 50000
    })
    return Promise.reject(error)
  }
)

export default service
