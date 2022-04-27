// 将模块统一暴露
import * as attr from './product/attr'
import * as home from './home/home'
import * as goods from './goods/goods'
import * as details from './details/details'
import * as shopCart from './shopCart/shopCart'
import * as collect from './collect/collect'
import * as order from './order/order'

//对外暴露
export default {
  attr,
  home,
  goods,
  details,
  shopCart,
  collect,
  order
}
