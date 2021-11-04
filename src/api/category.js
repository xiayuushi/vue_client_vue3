import request from '@/utils/request'

// 首页-全部分类（包含推荐商品）
export const homeCategoryHead = () => {
  return request('/home/category/head', 'get')
}

// 分类页-一级类目信息（包含二级分类信息）
export const getCategory = id => {
  return request('/category', 'get', { id })
}

// 分类页-二级类目-筛选条件
export const categorySubFilter = id => {
  return request('/category/sub/filter', 'get', { id })
}

// 分类页-二级类目-商品列表临时（params是一个对象，因此request()中第三参数不需要带'{}'）
export const categoryGoodsTemporary = params => {
  return request('/category/goods/temporary', 'post', params)
}

// 1、因为vue3的setup中定义方法通常采用函数表达式的形式，因此此处也定义成函数表达式
