// 引入二次封装
import request from '.././../utils/request.js'

// 登录
export function reqLogin(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}
// 查询
export function findUserName(userName) {
  return request({
    url: '/users/findUserName',
    method: 'post',
    data: {
      userName
    }
  })
}
// 注册
export function reqRegister(data) {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}
