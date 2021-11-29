<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress" >您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：{{ showAddress.receiver }}</span></li>
        <li><span>联系方式：</span>{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/,'$1****$2') }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation +' '+ showAddress.address }}</li>
      </ul>
      <a href="javascript:;" v-if="showAddress">修改地址</a>
    </div>
    <div class="action">
      <XxxButton class="btn">切换地址</XxxButton>
      <XxxButton class="btn">添加地址</XxxButton>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ChecekoutAddress',
  props: {
    addressList: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const showAddress = ref(null)
    if (props.addressList.length) {
      const userDefaultAddress = props.addressList.find(item => item.isDefault === 0)
      // eslint-disable-next-line vue/no-setup-props-destructure
      userDefaultAddress ? showAddress.value = userDefaultAddress : showAddress.value = props.addressList[0]
    }
    return { showAddress }
  }
}

// 1、提示 a value from the `props` in root scope of `setup()` will cause the value to lose reactivity..
// 1、只需要添加注释忽略该eslint报错即可
// N1、将props传递过来的复杂数据类型赋值给ref声明的响应式数据时，当ref响应式数据发生变化时，会因为同一引用而修改props传递过来的数据，虽不建议这么做但是可行
// N2、上面String.replace()中的正则部分，左侧为待替换的字符串的正则，右侧为需要替换的内容或者格式（左2右4，中间星号代替）
// N2、其中$1表示第一个括号的正则部分，$2表示第二个括号的正则部分，'$1****$2'表示两个括号中间的正则部分替换为星号
</script>

<style lang="less" scoped>
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
