<template>
  <div class="member-order-page">
    <!-- tab组件（tab栏） -->
    <XxxTabs v-model="activeName" @tab-click="tabClickHandler">
      <XxxTabsPanel
        v-for="item in orderStatusList"
        :key="item.name"
        :label="item.label"
        :name="item.name" />
    </XxxTabs>
    <!-- 订单列表（内容区） -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderDetail?.items.length === 0">暂无数据</div>
      <OrderItem :order="item" v-for="item in orderDetail?.items" :key="item.id" @on-cancel-order="cancelOrderHandler" />
    </div>
    <!-- 分页组件 -->
    <XxxPagination
      v-if="orderDetail?.counts"
      :totalCount="orderDetail?.counts"
      :defaultPage="params.page"
      :pageSize="params.pageSize"
      @onChange="params.page=$event" />
    <!-- 取消原因组件 -->
    <OrderCancel ref="target" />
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { orderStatusList } from '@/api/contant'
import { getMyMemberOrderDetail } from '@/api/order'
import OrderItem from './components/order_item'
import OrderCancel from './components/order_cancel'

const useCancelOrderHandler = () => {
  const target = ref(null)
  const cancelOrderHandler = (currentCancelOrder) => {
    target.value.openDialog(currentCancelOrder)
  }
  return { cancelOrderHandler, target }
}

export default {
  name: 'OrderPage',
  components: { OrderItem, OrderCancel },
  setup () {
    const activeName = ref('all')
    const orderDetail = ref(null)
    const loading = ref(false)
    const params = reactive({ page: 1, pageSize: 10, orderState: 0 })

    watch(params, () => {
      loading.value = true
      getMyMemberOrderDetail(params).then(res => {
        orderDetail.value = res.result
        loading.value = false
      })
    }, { immediate: true })

    const tabClickHandler = ({ index }) => {
      params.page = 1
      params.orderState = index
    }

    return { activeName, orderStatusList, orderDetail, tabClickHandler, loading, params, ...useCancelOrderHandler() }
  }
}

// 1、自定义tab组件@tab-click的tabClickHandler可以监听到tab切换，形参是一个对象，可以解构index记录当前点击项的索引
// 2、当tab切换时，需要做以下功能
// 2、1 页面应该重置为第一页
// 2、2 订单状态应该切换到相应的状态（监听传给后端的params参数，并且让params.orderState与点击项的索引建立联系）
// 3、useCancelOrderHandler是将取消订单的逻辑函数从setup中抽离出来便于直观查看，将当前取消订单的信息传递给取消组件order_cancel.vue内部
</script>

<style lang="less" scoped>
.member-order-page {
  height: 100%;
  background-color: #fff;
  .order-list {
    background: #fff;
    padding: 20px;

    position: relative;
    min-height: 400px;

    .loading {
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
    }
    .none {
      height: 400px;
      text-align: center;
      line-height: 400px;
      color: #999;
    }
  }
}
</style>
