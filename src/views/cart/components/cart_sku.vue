<template>
  <div class="cart-sku" ref="target">
    <!-- 当前已选可见SKU -->
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <!-- 默认隐藏的弹层 可重选SKU -->
    <div class="layer" v-if="visibile">
      <div class="loading" v-if="loading"></div>
      <GoodsSku :skuid="skuId" :goods="cartGoodsSku" @change="getCurrentChangeSku"  v-else />
      <XxxButton type="primary" size="mini" @click="submit" style="margin-left:60px" v-if="!loading">确定</XxxButton>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getCartGoodsSku } from '@/api/cart'
import GoodsSku from '../../goods/components/goods_sku'

export default {
  name: 'CartSku',
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  components: { GoodsSku },
  setup (props, { emit }) {
    const visibile = ref(false)
    const show = () => {
      visibile.value = true
    }
    const hide = () => {
      visibile.value = false
    }
    const toggle = () => {
      visibile.value ? hide() : show()
    }
    const target = ref(null)
    onClickOutside(target, () => hide())

    const loading = ref(false)
    const cartGoodsSku = ref(null)
    getCartGoodsSku(props.skuId).then(res => {
      loading.value = true
      cartGoodsSku.value = res.result
      loading.value = false
    })

    const currentSelectedSku = ref(null)
    const getCurrentChangeSku = (Sku) => {
      currentSelectedSku.value = Sku
    }

    const submit = () => {
      if (currentSelectedSku.value && currentSelectedSku.value.skuid && currentSelectedSku.value.skuid !== props.skuId) {
        emit('changeCartSku', currentSelectedSku.value)
        hide()
      }
    }

    return { visibile, toggle, target, cartGoodsSku, loading, getCurrentChangeSku, submit }
  }
}

// 1、购物车页面的重选SKU规格时，需要两个数据specs（可选规格集合）与skus（SKU集合），可以调用接口拿到并传递给GoodsSku组件
// 2、购物车页面的重选SKU规格时如果需要默认选中当前sku，则必须传入skuid属性
// 3、currentSelectedSku用于接收GoodsSku组件emit()传递过来的当前已选的SKU信息，但是该SKU信息只包含skuid、inventory、price、oldPrice、specsText这5个字段
// 4、submit函数用于将接收到的更改后的SKU传递给父组件，后续会在父组件中调用vuex定义的actions方法去更新购物车SKU数据
</script>

<style lang="less" scoped>
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    // 购物车页面的弹出层SKU边框的向上箭头
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
