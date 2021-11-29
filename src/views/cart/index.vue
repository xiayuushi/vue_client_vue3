<template>
  <div class="xxx-cart-page">
    <div class="container">
      <XxxBread>
        <XxxBreadItem to="/">首页</XxxBreadItem>
        <XxxBreadItem>购物车</XxxBreadItem>
      </XxxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120"><XxxCheckbox :modelValue="$store.getters['cart/isCheckedAll']" @change="checkAll">全选</XxxCheckbox></th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="$store.getters['cart/validList'].length === 0"><td colspan="6"><CartNone /></td></tr>
            <tr v-for="item in $store.getters['cart/validList']" :key="item.skuId">
              <td><XxxCheckbox :modelValue="item.selected" @change="$event => checkOne($event, item.skuId)" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${ item.id }`"><img :src="item.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <!-- 选择规格组件 -->
                    <CartSku :skuId="item.skuId" :attrsText="item.attrsText" @changeCartSku="$event => updateCartSku($event, item.skuId)" />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
                <p v-if="item.price > item.nowPrice">比加入时降价 <span class="red">&yen;{{ item.price-item.nowPrice }}</span></p>
              </td>
              <td class="tc">
                <XxxNumbox :modelValue="item.count" :max="item.stock" @change="$event => changeCount($event, item.skuId)" />
              </td>
              <td class="tc"><p class="f16 red">&yen;{{ Math.round(item.nowPrice * 100) * item.count / 100 }}</p></td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click="deleteCart(item.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
            <tr><td colspan="6"><h3 class="tit">失效商品</h3></td></tr>
            <tr v-for="item in $store.getters['cart/invalidList']" :key="item.skuId">
              <td><XxxCheckbox style="color:#eee;" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${ item.id }`"><img :src="item.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc"><p>&yen;{{ item.nowPrice }}</p></td>
              <td class="tc">{{ item.count }}</td>
              <td class="tc"><p>&yen;{{ Math.round(item.nowPrice * 100) * item.count / 100 }}</p></td>
              <td class="tc">
                <p><a class="green" href="javascript:;" @click="deleteCart(item.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XxxCheckbox :modelValue="$store.getters['cart/isCheckedAll']" @change="checkAll">全选</XxxCheckbox>
          <a href="javascript:;" @click="batchDeleteCart()">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters['cart/validListCounts'] }} 件商品，已选择 {{ $store.getters['cart/selectedListCounts'] }} 件，商品合计：
          <span class="red">¥{{ $store.getters['cart/selectedListAmount'] }}</span>
          <XxxButton type="primary" @click="checkout">下单结算</XxxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CartNone from './components/cart_none'
import CartSku from './components/cart_sku'
import Confirm from '@/library/Confirm/index.js'
import Message from '@/library/Message/index.js'
import GoodRelevant from '../goods/components/goods_relevant'

export default {
  name: 'CartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    const store = useStore()
    const checkOne = (isChecked, skuId) => {
      store.dispatch('cart/updateCart', { selected: isChecked, skuId })
    }
    const checkAll = (isChecked) => {
      store.dispatch('cart/checkAllCart', { selected: isChecked })
    }
    const deleteCart = (skuId) => {
      Confirm({ text: '是否删除当前商品？' })
        .then(() => {
          store.dispatch('cart/deleteCart', skuId)
        })
        .catch(err => console.log(err))
    }
    const batchDeleteCart = (isClearInvalid) => {
      Confirm({ text: `是否${isClearInvalid ? '清空失效的' : '删除已选中的'}购物车商品？` })
        .then(() => {
          store.dispatch('cart/batchDeleteCart', isClearInvalid)
          Message({ type: 'success', text: '操作成功' })
        })
        .catch(err => console.log(err))
    }
    const changeCount = (count, skuId) => {
      store.dispatch('cart/updateCart', { count, skuId })
    }

    const updateCartSku = (newSku, oldSkuId) => {
      store.dispatch('cart/updateCartSku', { newSku, oldSkuId })
    }

    const router = useRouter()
    const checkout = () => {
      if (store.getters['cart/selectedList'].length === 0) {
        return Message({ text: '请至少勾选一件商品再进行结算' })
      }
      Confirm({ text: '是否前往结算页面？' }).then(() => {
        router.push('/member/checkout')
      }).catch(() => {})
    }
    return { checkOne, checkAll, deleteCart, batchDeleteCart, changeCount, updateCartSku, checkout }
  }
}

// 1、XxxCheckbox组件此时不能使用v-model
// 1、因为v-model在给子组件赋值的同时也会修改父组件的值，而当前组件中使用的XxxCheckbox控制是否选中的数据是来源于vuex，而vuex的数据只能通过mutations定义方法来修改
// 2、使用vuex控制的数据，如果需要双向数据绑定，那只能拆分v-model，如 当前组件使用的 XxxCheckbox 与 XxxNumber
// 3、vue3中v-model可以拆分为modelValue与@update:modelValue
// 4、在自定义封装XxxCheckbox组件时暴露了@change事件，就是用于改值的，此时因为绑定的是vuex的数据，因此不能直接用拆分为@update:modelValue改值，但是可以通过@change事件对应的方法改值
// 5、封装XxxCheckbox时@change有提供传参，使用该组件时可以直接通过$event取参，但是使用该组件时如果@change对应的方法fn也需要传参，此时可以通过"($event)=>fn($event, fn自己的传参)"的形式兼顾两者的传参
// 6、vuex中mutations方法UPDATECART使用for..in..对传参做了要求，必须传入符合购物车商品的字段，因此传参时必须对应，否则无法成功传参
// 6、因此checkOne()在传入由XxxCheckbox组件@change的$event的值(上面的形参isChecked)时，必须给vuex中购物车商品对应的selected字段，否则单选框无法进行单选操作
// 7、Math.round(item.nowPrice * 100) * item.count / 100 是计算单个选中商品的金额时四舍五入保留两位小数
// 8、购物车商品单选需要区分两种情况：Q1未登录字体修改的是vuex的数据 Q2登录状态修改的是服务器的数据
// 9、batchDeleteCart()不传参或者传false则做批量删除购物车中选中的商品（不传参也必须加括号调用）；传参true表示清空购物车中的无效商品（同一个方法根据传参实现类似的功能）
// 10、去结算的逻辑：用户未勾选有效商品无法进行结算，用户已勾选未登录，则路由前置导航守卫强制用户先跳转登录（登录成功后会重定向到目标跳转页结算页）；用户已登录则直接进入结算页

// N1、@xxx="($event)=>fn($event,payload)" 表示接收子组件emit("xxx")传递过来的参数$event的同时，还传入了fn自己的参数payload，后续在实现fn函数时可以拿到这两个传参
// N2、@xxx="($event)=>fn($event,payload)" 参数位置必须对应
// N2、如果接收的参数$event放在第一参数位置，则第一参数就是子组件emit传递过来的参数；如果接收的参数$event放在第二参数位置，则第二参数就是子组件emit传递过来的参数
// N2、如果拿到以上参数与vuex中的mutations或者actions中的方法对接，则键名必须与vuex中的方法对应才能正确传参
// N3、updateCartSku方法中第一形参newSku是cart_sku.vue组件传递过来的购物车当前选中的SKU数据，第二形参goods是整个SKU数据，需要将第一形参覆盖第二形参，获取最新的SKU信息来达到更新购物车页面的购物车SKU数据的目的
</script>

<style lang="less" scoped>
.tc {
  text-align: center;
  .xxx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xxx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,td{
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
