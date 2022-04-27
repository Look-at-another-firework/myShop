// 引入二次封装
import request from '.././../utils/request.js'

// 修改数量
export function reqChangeNum(data) {
  return request({
    url: '/user/shoppingCart/updateShoppingCart',
    method: 'post',
    data
  })
}

// 删除
export function reqDeleteCart(data) {
  return request({
    url: '/user/shoppingCart/deleteShoppingCart',
    method: 'post',
    data
  })
}