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

/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品ID （路径参数）
 */
export const goodsEvaluate = id => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

/**
 * 获取商品的评价分页数据
 * @param {String} id - 商品ID （路径参数）
 * @param {Object} params - 商品评价所需的参数集合（具体参数需要参考接口文档）
 */
export const goodsEvaluatePage = (id, params) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}

// 1、yapi 平台可提供模拟接口，当后台接口未开发完毕或者没有数据的情况下，可以支持前端的开发。
// 1、例如 https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate
// 2、如果是http或者https开头的地址，那么axios实例对象配置了baseURL选项也不会生效，而是以http或者https的为准
