// 引入二次封装
import request from '.././../utils/request.js'

// 商品列表信息
export function reqGetCategory() {
  return request({
    url: '/product/getCategory',
    method: 'post'
  })
}
// 搜索
export function reqSearchCategory(data) {
  return request({
    url: '/product/getProductBySearch',
    method: 'post',
    data
  })
}

// 请求全部商品或分类商品数据

export function reqEveryCategory(url, data) {
  return request({
    url,
    method: 'post',
    data
  })
}
