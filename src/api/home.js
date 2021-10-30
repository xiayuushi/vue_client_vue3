import request from '@/utils/request'

// 获取首页热门品牌
export const homeBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

// 获取首页广告轮播图
export const homeBanner = (distributionSite = 1) => {
  return request('/home/banner', 'get', { distributionSite })
}

// 获取首页新鲜好物
export const homeNew = (limit = 4) => {
  return request('/home/new', 'get', { limit })
}

// 获取首页人气推荐
export const homeHot = () => {
  return request('/home/hot', 'get')
}

// 获取首页人气推荐
export const homeGoods = () => {
  return request('/home/goods', 'get')
}
