import request from '@/utils/request'

// 生成订单
export const createOrderPre = () => {
  return request('/member/order/pre', 'get')
}

// 添加收货地址 参数form是对象（详情字段参考接口文档）
export const memberAddress = (form) => {
  return request('/member/address', 'post', form)
}

// 更新收货地址 参数form是对象（详情字段参考接口文档）
export const updateMemberAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

// 提交订单 参数form是对象（详情字段参考接口文档）
export const memberOrder = (form) => {
  return request('/member/order', 'post', form)
}

// 获取订单 参数id是订单编号字符串
export const getMyMemberOrder = (id) => {
  return request(`/member/order/${id}`, 'get')
}
