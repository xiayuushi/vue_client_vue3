import request from '@/utils/request'

/**
* 商品信息-库存价格是否有效（支持本地购物车）
* @param {String} skuId - 商品SKUID
* @return: Promise
*/
export const getLatestCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}
