<template>
  <div class="xtx-pay-page">
    <div class="container">
      <XxxBread>
        <XxxBreadItem to="/">首页</XxxBreadItem>
        <XxxBreadItem to="/cart">购物车</XxxBreadItem>
        <XxxBreadItem>支付订单</XxxBreadItem>
      </XxxBread>
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p v-if="prePayInfo.countdown > -1">支付还剩 <span>{{ timeText }}</span>, 超时后将取消订单</p>
          <p v-else>订单已经超时</p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ prePayInfo.payMoney }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:;"></a>
          <a class="btn alipay" :href="aLiPayHref" target="_blank" @click="visibleDialog=true"></a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
      <!-- 支付提示对话框 -->
      <XxxDialog title="正在支付..." v-model:visible="visibleDialog">
      <div class="pay-wait">
        <img src="@/assets/images/load.gif" alt="">
        <div v-if="prePayInfo">
            <p>如果支付成功：</p>
            <RouterLink :to="`/member/order/${$route.query.id}`">查看订单详情></RouterLink>
            <p>如果支付失败：</p>
            <RouterLink to="/">查看相关疑问></RouterLink>
        </div>
      </div>
    </XxxDialog>
    </div>
  </div>

</template>

<script>
import { ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMyMemberOrder } from '@/api/order'
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { baseURL } from '@/utils/request'

export default {
  name: 'PayPage',
  setup () {
    const prePayInfo = ref(null)
    const route = useRoute()
    getMyMemberOrder(route.query.id).then(res => {
      prePayInfo.value = res.result
      time.value = res.result.countdown
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      resume()
    })

    const time = ref(0)
    const timeText = ref('')
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) {
        pause()
      }
    }, 1000, { immediate: false })
    onUnmounted(() => pause())

    const cbURL = encodeURIComponent('http://www.corho.com:8080/#/pay/callback')
    const aLiPayHref = `${baseURL}pay/aliPay?orderId=${route.query.id}&redirect=${cbURL}`

    const visibleDialog = ref(false)

    return { prePayInfo, timeText, aLiPayHref, visibleDialog }
  }
}

// 1、timeText.value = dayjs.unix(time.value).format('mm分ss秒') 使用dayjs的方法将服务器返回的数值转成时间戳再转成相应的'xx分xx秒'的格式
// 2、拿到服务器返回的时间字段一开始就需要转成'xx分xx秒'的格式，因此以上代码在两个地方都写了，防止一开始从xx分58秒开始倒计时...
// 3、为a标签添加target属性，属性值为_blank就会以新开页的形式跳转到href指定的页面

// 4、跳转支付平台的a标签的href属性值完整包含以下信息：后台支付基准地址 + 接口指定的支付平台（如 /pay/aliPay） + 订单id + 回跳地址（localhost中对应的那个线上IP地址对应的支付地址）
// 4、const href = `${baseURL}/pay/aliPay?orderId=${route.query.id}&redirect=http://www.corho.com:8080/#/pay/callback`
// 4、因为地址可能存在特殊字符，尽量转成编码字符进行传输，因此 将回调地址进行处理 例如：encodeURIComponent(回调地址)
// 4、const cbUrl = encodeURIComponent('http://www.corho.com:8080/#/pay/callback')
// 4、a标签跳转支付宝支付的href属性值为： const href = `${baseURL}/pay/aliPay?orderId=${route.query.id}&redirect=${cbUrl}`
// 4、接口指定字段分别是orderId与redirect，因此需要准备这两个字段的相应值
// 5、沙箱测试账号 jfjbwb4477@sandbox.com 支付与登录密码都是111111

</script>

<style lang="less" scoped>
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .tip {
    padding-left: 10px;
    flex: 1;
    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: @priceColor;
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;
    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: @xtxColor;
    }
    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
    }
    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat center / contain;
    }
  }
}
.pay-wait {
  display: flex;
  justify-content: space-around;
  p {
    margin-top: 30px;
    font-size: 14px;
  }
  a {
    color: @xtxColor;
  }
}
</style>
