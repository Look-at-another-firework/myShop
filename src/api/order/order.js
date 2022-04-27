// 引入二次封装
import request from '.././../utils/request.js'

// 结算
export function reqOrder(data) {
  return request({
    url: '/user/order/addOrder',
    method: 'post',
    data
  })
}

// 获取结算的数据
export function reqGetOrder(data) {
  return request({
    url: '/user/order/getOrder',
    method: 'post',
    data
  })
}
