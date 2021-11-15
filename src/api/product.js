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
