import request from '@/utils/request'

// 获取首页热门品牌
export const homeBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
