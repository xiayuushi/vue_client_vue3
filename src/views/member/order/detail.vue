<template>
  <div class="member-order-detail">
    <!-- 操作栏 -->
    <DetailAction :order="orderDetail" />
    <!-- 进度条 -->
    <DetailStep :order="orderDetail" />
    <!-- 物流栏 -->
    <!-- 商品信息 -->
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMyMemberOrder } from '@/api/order'
import DetailAction from './components/detail_action'
import DetailStep from './components/detail_step'

export default {
  name: 'MemberOrderDetail',
  components: { DetailAction, DetailStep },
  setup () {
    const route = useRoute()
    const orderDetail = ref(null)
    getMyMemberOrder(route.params.id).then(res => (orderDetail.value = res.result))
    return { orderDetail }
  }
}
</script>

<style lang="less" scoped>
.member-order-detail {
  background-color: #fff;
}
</style>
