<template>
<div class="detail-step" v-if="order">
    <XxxSteps :active="order.orderState===6?1:order.orderState">
    <XxxStepsItem title="提交订单" :desc="order.createTime" />
    <XxxStepsItem title="付款成功" :desc="order.payTime" />
    <XxxStepsItem title="商品发货" :desc="order.consignTime" />
    <XxxStepsItem title="确认收货" :desc="order.endTime" />
    <XxxStepsItem title="订单完成" :desc="order.evaluationTime" />
  </XxxSteps>
</div>
</template>

<script>
export default {
  name: 'DetailSteps',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  }
}

// 1、:active="order.orderState===6?1:order.orderState"表示当状态为6（已取消）时，则将其重置为1（待付款）
</script>

<style lang="less" scoped>
.detail-step {
  padding: 20px;
}
</style>
