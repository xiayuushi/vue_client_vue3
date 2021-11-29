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

// （登录后）删除购物车商品 传入SKUID集合 string[]
export const memberCartDelete = (ids) => {
  return request('/member/cart', 'delete', { ids })
}

// （登录后）添加商品到购物车
export const memberCartAdd = (skuId, count) => {
  return request('/member/cart', 'post', { skuId, count })
}

// （登录后）修改购物车选中状态与数量
export const memberCartPut = (skuId, selected, count) => {
  return request(`/member/cart/${skuId}`, 'put', { skuId, selected, count })
}

// （登录后）修改购物车全选状态
export const memberCartSelected = (ids, selected) => {
  return request('/member/cart/selected', 'put', { ids, selected })
}

// N1、memberCartMerge接口，参数payloadList是一个数组，不要写成  return request('/member/cart/merge', 'post', {payloadList}) 否则服务器会返回500错误
// N2、memberCartDelete接口，参数ids可以是一个字符串也可以是一个数组，传入单个ids则删除单个，传入数组ids，则批量删除
// N2、例如 传入ids="xxx"则删除'xxx'对应的商品；如传入ids=['111','222']则批量删除
// N4、定义API接口时，形参是对象，则实参必须传入对象（或者对象解构），如果形参是值的形式，则实参传入也必须是值的形式
