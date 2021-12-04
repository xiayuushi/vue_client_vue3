<template>
  <div class="member-order-page">
    <!-- tab组件（tab栏） -->
    <XxxTabs v-model="activeName">
      <XxxTabsPanel
        v-for="item in orderStatusList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      ></XxxTabsPanel>
    </XxxTabs>
    <!-- 订单列表（内容区） -->
    <div class="order-list">
      <OrderItem :order="item" v-for="item in orderDetail?.items" :key="item.id" />
    </div>
    <!-- 分页组件 -->
    <XxxPagination :totalCount="orderDetail?.counts" :pageSize="orderDetail?.pageSize" />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { orderStatusList } from '@/api/contant'
import { getMyMemberOrderDetail } from '@/api/order'
import OrderItem from './components/order_item'

export default {
  name: 'OrderPage',
  components: { OrderItem },
  setup () {
    const activeName = ref('all')
    const orderDetail = ref(null)
    const params = reactive({ page: 1, pageSize: 10, orderState: 0 })
    getMyMemberOrderDetail(params).then(res => (orderDetail.value = res.result))

    return { activeName, orderStatusList, orderDetail }
  }
}
</script>

<style lang="less" scoped>
.member-order-page {
  height: 100%;
  background-color: #fff;
  .order-list {
    background: #fff;
    padding: 20px;
  }
}
</style>
