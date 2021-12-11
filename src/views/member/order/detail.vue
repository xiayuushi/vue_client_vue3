<template>
  <div class="member-order-detail">
    <!-- 操作栏 -->
    <DetailAction :order="orderDetail" />
    <!-- 进度条 -->
    <DetailStep :order="orderDetail" />
    <!-- 物流信息 -->
    <Suspense>
      <template #default>
        <DetailLogistics :order="orderDetail" v-if="[3,4,5].includes(orderDetail?.orderState)" />
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </Suspense>
    <!-- 商品信息 -->
    <DetailInfo :order="orderDetail" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMyMemberOrder } from '@/api/order'
import DetailAction from './components/detail_action'
import DetailStep from './components/detail_step'
import DetailLogistics from './components/detail_logistics'
import DetailInfo from './components/detail_info'

export default {
  name: 'MemberOrderDetail',
  components: { DetailAction, DetailStep, DetailLogistics, DetailInfo },
  setup () {
    const route = useRoute()
    const orderDetail = ref(null)
    getMyMemberOrder(route.params.id).then(res => (orderDetail.value = res.result))
    return { orderDetail }
  }
}

// 1、[3,4,5].includes(orderDetail.orderState) 当订单状态为 '3待收货'、'4待评价'、'5待评价'时才会显示该组件

</script>

<style lang="less" scoped>
.member-order-detail {
  height: 100%;
  background-color: #fff;
  .loading {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background-color: #f5f5f5;
    margin: 30px 50px 0;
  }
}
</style>
