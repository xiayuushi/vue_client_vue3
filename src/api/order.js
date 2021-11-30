import request from '@/utils/request'

// 生成订单
export const createOrderPre = () => {
  return request('/member/order/pre', 'get')
}

// 添加收货地址 参数form是对象
export const memberAddress = (form) => {
  return request('/member/address', 'post', form)
}

// 添加收货地址 参数form是对象
export const updateMemberAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}
