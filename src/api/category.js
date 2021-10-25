import request from '@/utils/request'

// 首页-全部分类（包含推荐商品）
export const homeCategoryHead = () => {
  return request('/home/category/head', 'get')
}

// 1、因为vue3的setup中定义方法通常采用函数表达式的形式，因此此处也定义成函数表达式
