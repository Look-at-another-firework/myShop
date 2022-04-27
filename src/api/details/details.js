// 引入二次封装
import request from '.././../utils/request.js'

// 商品列表信息
export function reqGetDetails(data) {
  return request({
    url: '/product/getDetails',
    method: 'post',
    data
  })
}

// 商品图片信息
export function reqGetDetailsImg(data) {
  return request({
    url: '/product/getDetailsPicture',
    method: 'post',
    data
  })
}

// 加入购物车
export function reqShopCart(data) {
  return request({
    url: '/user/shoppingCart/addShoppingCart',
    method: 'post',
    data
  })
}

// 喜欢
export function reqLike(data) {
  return request({
    url: '/user/collect/addCollect',
    method: 'post',
    data
  })
}
