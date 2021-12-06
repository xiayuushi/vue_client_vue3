<template>
  <XxxDialog title="取消订单" v-model:visible="showDialog">
    <!-- 组件内容 -->
    <div class="cancel-info">
        <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
        <p class="tip">请选择取消订单的原因（必选）：</p>
        <div class="btn">
          <a
            v-for="item in cancelReason"
            :key="item"
            href="javascript:;"
            @click="selectedReasonText = item"
            :class="{ active: selectedReasonText === item }"
          >
            {{ item }}
          </a>
        </div>
    </div>
    <!-- 按钮操作 -->
    <template #footer>
      <XxxButton type="gray" @click="showDialog=false" style="margin-right:20px">取消</XxxButton>
      <XxxButton type="primary" @click="submit">确认</XxxButton>
    </template>
  </XxxDialog>
</template>

<script>
import { ref } from 'vue'
import { cancelOrder } from '@/api/order'
import { cancelReason } from '@/api/contant'
import Message from '@/library/Message/index.js'

export default {
  name: 'OrderCancel',
  setup () {
    const showDialog = ref(false)
    const currentOrder = ref(null)
    const selectedReasonText = ref('')
    const openDialog = (currentCancelOrder) => {
      showDialog.value = true
      currentOrder.value = currentCancelOrder
    }
    const submit = async () => {
      if (!selectedReasonText.value) return Message({ text: '请选择取消订单的原因' })
      const { result } = await cancelOrder(currentOrder.value.id, selectedReasonText.value)
      Message({ type: 'success', text: '取消订单成功' })
      currentOrder.value.orderState = result.orderState
      showDialog.value = false
    }
    return { showDialog, cancelReason, selectedReasonText, openDialog, submit }
  }
}
// 1、openDialog是给父组件使用的，而形参currentCancelOrder可以接收父组件点击时传入的的当前点击取消的订单信息
// 2、取消订单后应该将订单状态重置为'已取消'（相当于从'待支付'订单列表删除了）
</script>

<style lang="less" scoped>
 .xxx-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n){
        margin-right: 0;
      }
      &:hover,&.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
