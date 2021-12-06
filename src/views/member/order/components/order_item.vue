<template>
  <div class="order-item">
    <div class="head">
      <span>下单时间：{{ order.createTime }}</span>
      <span>订单编号：{{ order.id }}</span>
      <!-- 当订单状态为'1待付款'时，才会显示付款倒计时 -->
      <span class="down-time" v-if="order.orderState===1">
        <i class="iconfont icon-down-time"></i>
        <b>付款截止：{{ timeText }}</b>
      </span>
      <!-- 当订单状态为 '5已完成'或者'6已取消'时才会显示'删除'按钮 -->
      <a href="javascript:;" class="del" v-if="[5,6].includes(order.orderState)" @click="$emit('on-delete-order', order)">删除</a>
    </div>
    <div class="body">
      <div class="column goods">
        <ul>
          <li v-for="item in order.skus" :key="item.id">
            <a class="image" href="javascript:;">
              <img
                :src="item.image"
                alt=""
              />
            </a>
            <div class="info">
              <p class="name ellipsis-2">
                {{ item.name }}
              </p>
              <p class="attr ellipsis">
                <span>{{ item.attrsText }}</span>
              </p>
            </div>
            <div class="price">¥{{ item.realPay }}</div>
            <div class="count">x{{ item.quantity }}</div>
          </li>
        </ul>
      </div>
      <div class="column state">
        <!-- orderState是订单状态（1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部） -->
        <p>{{ orderStatusList[order.orderState].label }}</p>
        <!-- 订单状态body部分 当订单状态为 '3待收货'时才会显示'查看物流' -->
        <!-- 订单状态body部分 当订单状态为 '4待评价'时才会显示'评价商品' -->
        <!-- 订单状态body部分 当订单状态为 '5已完成'时才会显示'查看评价' -->
        <p v-if="order.orderState===3"><a href="javascript:;" class="green">查看物流</a></p>
        <p v-if="order.orderState===4"><a href="javascript:;" class="green">评价商品</a></p>
        <p v-if="order.orderState===5"><a href="javascript:;" class="green">查看评价</a></p>
      </div>
      <div class="column amount">
        <p class="red">¥{{ order.payMoney }}</p>
        <p>（含运费：¥{{ order.postFee }}）</p>
        <p>在线支付</p>
      </div>
      <div class="column action">
        <!-- 订单状态body部分 当订单状态为 '1待付款'时 右侧才会显示 '立即付款' '查看详情' '取消订单' -->
        <!-- 订单状态body部分 当订单状态为 '2待发货'时 右侧才会显示 '查看详情' '再次购买' -->
        <!-- 订单状态body部分 当订单状态为 '3待收货'时 右侧才会显示 '确认收货' '查看详情' '再次购买' -->
        <!-- 订单状态body部分 当订单状态为 '4待评价'时 右侧才会显示 '查看详情' '再次购买' '申请售后' -->
        <!-- 订单状态body部分 当订单状态为 '5待评价'时 右侧才会显示 '查看详情' '再次购买' '申请售后' -->
        <!-- 订单状态body部分 当订单状态为 '6已取消'时 右侧才会显示 '查看详情'   -->
        <XxxButton v-if="order.orderState===1" type="primary" size="small" @click="$router.push(`/member/pay?id=${order.id}`)">立即付款</XxxButton>
        <XxxButton v-if="order.orderState===3" type="primary" size="small">确认收货</XxxButton>
        <p><a href="javascript:;" @click="$router.push(`/member/order/${order.id}`)">查看详情</a></p>
        <p v-if="order.orderState===1" @click="$emit('on-cancel-order', order)"><a href="javascript:;">取消订单</a></p>
        <p v-if="[2,3,4,5].includes(order.orderState)"><a href="javascript:;">再次购买</a></p>
        <p v-if="[4,5].includes(order.orderState)"><a href="javascript:;">申请售后</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import { orderStatusList } from '@/api/contant'
import { payInterval } from '@/hooks'

export default {
  name: 'OrderItem',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['on-cancel-order', 'on-delete-order'],
  setup (props) {
    const { start, timeText } = payInterval()
    start(props.order.countdown)

    return { orderStatusList, timeText }
  }
}

// 1、每条订单状态的渲染都有各自的状态与操作按钮

// 2、订单状态head部分 当订单状态为 '1待付款'时  顶部才会显示'付款倒计时'
// 2、订单状态head部分 当订单状态为 '5已完成'或者'6已取消'时 顶部才会显示'删除'按钮

// 3、订单状态body部分 当订单状态为 '3待收货'时 中间才会显示'查看物流'
// 3、订单状态body部分 当订单状态为 '4待评价'时 中间才会显示'评价商品'
// 3、订单状态body部分 当订单状态为 '5已完成'时 中间才会显示'查看评价'

// 3、订单状态body部分 当订单状态为 '1待付款'时 右侧才会显示 '立即付款' '查看详情' '取消订单'
// 3、订单状态body部分 当订单状态为 '2待发货'时 右侧才会显示 '查看详情' '再次购买'
// 3、订单状态body部分 当订单状态为 '3待收货'时 右侧才会显示 '确认收货' '查看详情' '再次购买'
// 3、订单状态body部分 当订单状态为 '4待评价'时 右侧才会显示 '查看详情' '再次购买' '申请售后'
// 3、订单状态body部分 当订单状态为 '5待评价'时 右侧才会显示 '查看详情' '再次购买' '申请售后'
// 3、订单状态body部分 当订单状态为 '6已取消'时 右侧才会显示 '查看详情'

// 4、取消订单时需要弹出对话框，因为当前组件是会在父组件中进行遍历的，并且并非只有取消订单一种操作
// 4、因此建议将弹出取消对话框的操作放在父组件中去完成
// N、orderState是订单状态（1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部）

</script>

<style lang="less" scoped>
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
