<template>
  <div class="xxx-pay-checkout-page">
    <div class="container">
      <XxxBread>
        <XxxBreadItem to="/">首页</XxxBreadItem>
        <XxxBreadItem to="/cart">购物车</XxxBreadItem>
        <XxxBreadItem >填写订单</XxxBreadItem>
      </XxxBread>
      <div class="wrapper" v-if="checkoutDatalist">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <CheckoutAddress :address-list="checkoutDatalist.userAddresses" @change="changeAddress" />
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in checkoutDatalist.goods" :key="item.skuId">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="item.picture" alt="">
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ item.payPrice }}</td>
                <td>{{ item.count }}</td>
                <td>&yen;{{ item.totalPrice }}</td>
                <td>&yen;{{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
         <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl><dt>商品件数：</dt><dd>{{ checkoutDatalist.summary.goodsCount }}件</dd></dl>
            <dl><dt>商品总价：</dt><dd>¥{{ checkoutDatalist.summary.totalPrice }}</dd></dl>
            <dl><dt>运<i></i>费：</dt><dd>¥{{ checkoutDatalist.summary.postFee }}</dd></dl>
            <dl><dt>应付总额：</dt><dd class="price">¥{{ checkoutDatalist.summary.totalPayPrice }}</dd></dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XxxButton type="primary" @click="submitOrder">提交订单</XxxButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { createOrderPre, memberOrder } from '@/api/order'
import Message from '@/library/Message/index.js'
import CheckoutAddress from './components/checkout_address'

export default {
  name: 'PayCheckoutPage',
  components: { CheckoutAddress },
  setup () {
    const checkoutDatalist = ref(null)
    const params = reactive({
      goods: [],
      addressId: null,
      deliveryTimeType: 1,
      payType: 1,
      payChannel: 1,
      buyerMessage: null
    })

    createOrderPre().then(res => {
      checkoutDatalist.value = res.result
      params.goods = res.result.goods.map(({ skuId, count }) => ({ skuId, count }))
    })

    const changeAddress = (addressId) => {
      params.addressId = addressId
    }

    const router = useRouter()
    const submitOrder = async () => {
      if (!params.addressId) return Message({ text: '请先选择收货地址' })
      const { result } = await memberOrder(params)
      router.push('/member/pay?id=' + result.id)
      Message({ type: 'success', text: '提交订单成功' })
    }

    return { checkoutDatalist, changeAddress, submitOrder }
  }
}

// 1、不要直接在setup函数中使用async进行异步代码改写
// 2、但在setup内的其他函数中可以使用async与await将异步代码以同步方式书写

</script>

<style lang="less" scoped>
.xxx-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,&:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
