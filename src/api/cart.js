import request from '@/utils/request'

/**
* 商品信息-库存价格是否有效（支持本地购物车）
* @param {String} skuId - 商品SKUID
* @return: Promise
*/
export const getLatestCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}

/**
* 商品信息-SKU
* @param {String} skuId - 商品SKUID
* @return: Promise
*/
export const getCartGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

/**
* 合并购物车
* @param {Array<object>} 整体参数格式 object[] 例如 [{skuId: 'xxx', selected: true , count: 12 }]
* @param {String} object.skuId - 商品SKUID
* @param {Boolean} object.selected - 是否选中
* @param {Number} object.count - 数量
* @return: Promise
*/
export const memberCartMerge = (payloadList) => {
  return request('/member/cart/merge', 'post', payloadList)
}

// （登录后）获取购物车数据
export const memberCart = () => {
  return request('/member/cart', 'get')
}

// N1、memberCartMerge接口，参数payloadList是一个数组，不要写成  return request('/member/cart/merge', 'post', {payloadList}) 否则服务器会返回500错误
