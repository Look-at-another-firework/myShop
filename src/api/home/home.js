// 引入二次封装
import request from '.././../utils/request.js'

// 轮播图
export function reqCarousel() {
  return request({
    url: '/resources/carousel',
    method: 'post'
  })
}

// 封装其他的
export function getPromo(categoryName, api) {
  api = api != undefined ? api : '/product/getPromoProduct'
  return request({
    url: api,
    method: 'post',
    data: categoryName
  })
}

// 删除删除列表中的该商品信息
export function reqRemoveInfo(data) {
  return request({
    url: '/user/collect/deleteCollect',
    method: 'post',
    data
  })
}

// 获取购物车数据
export function reqGetShopCart(data) {
  return request({
    url: '/user/shoppingCart/getShoppingCart',
    method: 'post',
    data
  })
}

// 获取购物车数据
export function reqGetReadme() {
  return request({
    url: '/public/docs/README.md',
    method: 'get'
  })
}
