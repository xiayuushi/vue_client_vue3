import request from '@/utils/request'

// 生成订单
export const createOrderPre = () => {
  return request('/member/order/pre', 'get')
}
