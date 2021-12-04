export const topCateList = ['居家', '美食', '服饰', '母婴', '个护', '严选', '数码', '运动', '杂货']

// 订单状态（定义以下数据索引时与接口数据orderState的值对应，如0对应'全部订单'）
export const orderStatusList = [
  { name: 'all', label: '全部订单' },
  { name: 'unpay', label: '待付款' },
  { name: 'deliver', label: '待发货' },
  { name: 'receive', label: '待收货' },
  { name: 'comment', label: '待评价' },
  { name: 'complete', label: '已完成' },
  { name: 'cancel', label: '已取消' }
]
