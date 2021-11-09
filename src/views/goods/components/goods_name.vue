<template>
  <p class="g-name">{{ goods.name }}</p>
  <p class="g-desc">{{ goods.desc }}</p>
  <p class="g-price">
    <span>{{ goods.price }}</span>
    <span>{{ goods.oldPrice }}</span>
  </p>
  <div class="g-service">
    <dl>
      <dt>促销</dt>
      <dd>12月好物放送，App领券购买直降120元</dd>
    </dl>
    <dl>
      <dt>配送</dt>
      <dd>至 <XxxCity :fullLocation="fullLocation" @update:fullLocation="changeFullLocation" /></dd>
    </dl>
    <dl>
      <dt>服务</dt>
      <dd>
        <span>无忧退货</span>
        <span>快速退款</span>
        <span>免费包邮</span>
        <a href="javascript:;">了解详情</a>
      </dd>
    </dl>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'GoodsName',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    // 用户未登录（显示的系统定义的默认地址）
    const provinceCode = ref('110000')
    const cityCode = ref('119900')
    const countyCode = ref('110101')
    const fullLocation = ref('北京市 市辖区 东城区')

    // 用户已登录（显示的用户设置的默认地址）
    if (props.goods.userAddresses) {
      const defaultAddress = props.goods.userAddresses.find(item => item.isDefault === 1)
      if (defaultAddress) {
        provinceCode.value = defaultAddress.provinceCode
        cityCode.value = defaultAddress.cityCode
        countyCode.value = defaultAddress.countyCode
        fullLocation.value = defaultAddress.fullLocation
      }
    }

    // 用户点选更改了收货地址
    const changeFullLocation = payload => {
      provinceCode.value = payload.provinceCode
      cityCode.value = payload.cityCode
      countyCode.value = payload.countyCode
      fullLocation.value = payload.fullLocation
    }

    return { fullLocation, changeFullLocation }
  }
}

// 1、vue3支持多根元素，即使在IDE报错必须有一个根容器也可以运行
// 2、如果想关闭IDE的报错，可以找到项目根目录下的.vscode目录的settings.json文件(如无该文件则新建之)
// 2、加入一行："vetur.validation.template": false
// 2、后续，不会进行模板检查也就不提示这个错误了，但eslint的模板检查功能也失去了
// 3、用户未登录则显示的默认的省市区地址进行展示，因此需要定义省市区code，以及它们拼凑组成的文字交给城市组件做默认显示
// 3、用户已登录则必须从用户的默认收货地址中遍历出对应的四项数据进行赋值，将拼凑组成的文字交给城市组件做默认展示
// 4、用户还可以点选地址，点选后的数据需要传到当前组件中去改写用户设置的默认地址
// 5、此处:fullLocation="fullLocation" @update:fullLocation="changeFullLocation"不能简写为"v-model:fullLocation"因为changeFullLocation函数修改的不仅仅是fullLocation的数据

</script>

<style lang="less" scoped>
.g-name {
  font-size: 22px
}
.g-desc {
  color: #999;
  margin-top: 10px;
}
.g-price {
  margin-top: 10px;
  span {
    &::before {
      content: "¥";
      font-size: 14px;
    }
    &:first-child {
      color: @priceColor;
      margin-right: 10px;
      font-size: 22px;
    }
    &:last-child {
      color: #999;
      text-decoration: line-through;
      font-size: 16px;
    }
  }
}
.g-service {
  background: #f5f5f5;
  width: 500px;
  padding: 20px 10px 0 10px;
  margin-top: 10px;
  dl {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      color: #666;
      &:last-child {
        span {
          margin-right: 10px;
          &::before {
            content: "•";
            color: @xtxColor;
            margin-right: 2px;
          }
        }
        a {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
