// 引入二次封装
import request from '.././../utils/request.js'

// 获取收藏的数据
export function reqCollectInfo(data) {
  return request({
    url: '/user/collect/getCollect',
    method: 'post',
    data
  })
}
