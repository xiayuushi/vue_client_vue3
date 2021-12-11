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
      <OrderItem
      v-for="item in orderDetail?.items"
      :key="item.id"
      :order="item"
      @on-cancel-order="cancelOrderHandler"
      @on-delete-order="deleteOrderHandler"
      @on-confirm-order="confirmOrderHandler"
      @on-logistics-order="logisticsOrderHandler" />
    </div>
    <!-- 分页组件 -->
    <XxxPagination
      v-if="orderDetail?.counts"
      :totalCount="orderDetail?.counts"
      :defaultPage="params.page"
      :pageSize="params.pageSize"
      @onChange="params.page=$event" />
    <!-- 取消原因组件 -->
    <OrderCancel ref="cancelComponent" />
    <!-- 查看物流组件 -->
    <OrderLogistics ref="logisticsComponent" />
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { orderStatusList } from '@/api/contant'
import { getMyMemberOrderDetail, deleteOrder, confirmOrder } from '@/api/order'
import OrderItem from './components/order_item'
import OrderCancel from './components/order_cancel'
import OrderLogistics from './components/order_logistics'
import Confirm from '@/library/Confirm/index.js'
import Message from '@/library/Message/index.js'

export const useCancelOrderHandler = () => {
  const cancelComponent = ref(null)
  const cancelOrderHandler = (currentCancelOrder) => {
    cancelComponent.value.openDialog(currentCancelOrder)
  }
  return { cancelOrderHandler, cancelComponent }
}

export const useConfirmOrderHandler = () => {
  const confirmOrderHandler = (currentConfirmOrder) => {
    Confirm({ text: '是否确认收货？' }).then(() => {
      confirmOrder(currentConfirmOrder.id).then(res => {
        Message({ type: 'success', text: '确认收货成功' })
        currentConfirmOrder.orderState = res.result.orderState
      })
    }).catch(() => {})
  }
  return { confirmOrderHandler }
}

export const useLogisticsOrderHandler = () => {
  const logisticsComponent = ref(null)
  const logisticsOrderHandler = (currentLogisticsOrder) => {
    logisticsComponent.value.openDialog(currentLogisticsOrder.id)
  }
  return { logisticsOrderHandler, logisticsComponent }
}

export default {
  name: 'OrderPage',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')
    const orderDetail = ref(null)
    const loading = ref(false)
    const params = reactive({ page: 1, pageSize: 10, orderState: 0 })

    const refreshOrderList = () => {
      loading.value = true
      getMyMemberOrderDetail(params).then(res => {
        orderDetail.value = res.result
        loading.value = false
      })
    }
    watch(params, () => {
      refreshOrderList()
    }, { immediate: true })

    const tabClickHandler = ({ index }) => {
      params.page = 1
      params.orderState = index
    }

    const deleteOrderHandler = (currentDeleteOrder) => {
      Confirm({ text: '是否删除当前订单？' }).then(async () => {
        await deleteOrder(currentDeleteOrder.id)
        Message({ type: 'success', text: '删除订单成功' })
        refreshOrderList()
      }).catch(() => { })
    }

    return {
      activeName,
      orderStatusList,
      orderDetail,
      tabClickHandler,
      loading,
      params,
      deleteOrderHandler,
      ...useCancelOrderHandler(),
      ...useConfirmOrderHandler(),
      ...useLogisticsOrderHandler()
    }
  }
}

// 1、自定义tab组件@tab-click的tabClickHandler可以监听到tab切换，形参是一个对象，可以解构index记录当前点击项的索引
// 2、当tab切换时，需要做以下功能
// 2、1 页面应该重置为第一页
// 2、2 订单状态应该切换到相应的状态（监听传给后端的params参数，并且让params.orderState与点击项的索引建立联系）
// 3、useCancelOrderHandler是将取消订单的逻辑函数从setup中抽离出来便于直观查看，将当前取消订单的信息传递给取消组件order_cancel.vue内部
// 4、订单支付成功后，需要手动模拟发货才能看到'确认收货'按钮
// 4、模拟发货直接将订单id拼接到参数后：如 http://pcapi-xiaotuxian-front-devtest.itheima.net/member/order/consignment/1467888949115490305
// 5、因为取消订单、确认订单、查看物流都会在后续其他页面中使用到，为了在其他组件进行复用，将其逻辑提取封装为函数
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
