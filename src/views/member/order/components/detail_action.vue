<template>
  <div class="detail-action" v-if="order">
    <div class="state">
      <span class="iconfont icon-order-unpay"></span>
      <p>{{ orderStatusList[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
        <!-- 待付款 -->
      <template v-if="order.orderState === 1">
        <XxxButton @click="$router.push('/member/pay?id='+order.id)" type="primary" size="small">立即付款</XxxButton>
        <XxxButton type="gray" size="small">取消订单</XxxButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <XxxButton type="primary" size="small">再次购买</XxxButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">
        <XxxButton type="primary" size="small">确认收货</XxxButton>
        <XxxButton type="plain" size="small">再次购买</XxxButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <XxxButton type="primary" size="small">再次购买</XxxButton>
        <XxxButton type="plain" size="small">评价商品</XxxButton>
        <XxxButton type="gray" size="small">申请售后</XxxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <XxxButton type="primary" size="small">再次购买</XxxButton>
        <XxxButton type="plain" size="small">查看评价</XxxButton>
        <XxxButton type="gray" size="small">申请售后</XxxButton>
      </template>
      <!-- 已取消 -->
    </div>
  </div>
</template>

<script>
import { orderStatusList } from '@/api/contant'
export default {
  name: 'OrderDetailAction',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  setup () {
    return { orderStatusList }
  }
}

// 1、按照订单状态显示按钮
// 待付款：立即付款，取消订单
// 待发货：再次购买
// 待收货：确认收货，再次购买
// 待评价：评价商品，再次购买，申请售后
// 已完成：查看评价，再次购买，申请售后
// 已取消：-
</script>

<style lang="less" scoped>
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xxx-button {
      margin-left: 20px;
    }
  }
}
</style>
