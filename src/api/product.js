// 提供商品相关的API函数
import request from '@/utils/request'

/**
* 获取商品详情
* @param {String} id - 商品id
*/
export const findGoods = id => {
  return request('/goods', 'get', { id })
}

/**
* 同类推荐 | 猜你喜欢
* @param {String} id - 商品id（传入代表查询相关商品，不传代表查询猜你喜欢）
* @param {Number} limit - 数量限制（默认16张）
*/
export const goodsRelevant = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
* 热销推荐
* @param {String} id - 商品id
* @param {Number} limit - 展示数量限制（默认展示3个）
* @param {Number} type - 热销类型，1为24小时，2为周榜，3为总榜（默认为1）
*/
export const goodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}
