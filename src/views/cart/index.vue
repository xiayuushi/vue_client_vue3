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
              <th width="120"><XxxCheckbox :modelValue="$store.getters['cart/isCheckedAll']">全选</XxxCheckbox></th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-for="item in $store.getters['cart/validList']" :key="item.id">
              <td><XxxCheckbox :modelValue="item.selected" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${ item.id }`"><img :src="item.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <!-- 选择规格组件 -->
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
                <p v-if="item.price > item.nowPrice">比加入时降价 <span class="red">&yen;{{ item.price-item.nowPrice }}</span></p>
              </td>
              <td class="tc">
                <XxxNumbox :modelvalue="item.count" />
              </td>
              <td class="tc"><p class="f16 red">&yen;{{ Math.round(item.nowPrice * 100) * item.count / 100 }}</p></td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
            <tr><td colspan="6"><h3 class="tit">失效商品</h3></td></tr>
            <tr v-for="item in $store.getters['cart/invalidList']" :key="item.id">
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
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XxxCheckbox :modelValue="$store.getters['cart/isCheckedAll']">全选</XxxCheckbox>
          <a href="javascript:;">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters['cart/validListCounts'] }} 件商品，已选择 {{ $store.getters['cart/selectedListCounts'] }} 件，商品合计：
          <span class="red">¥{{ $store.getters['cart/selectedListAmount'] }}</span>
          <XxxButton type="primary">下单结算</XxxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>

<script>
import GoodRelevant from '../goods/components/goods_relevant'

export default {
  name: 'CartPage',
  components: { GoodRelevant },
  setup () {
    return { }
  }
}

// 1、XxxCheckbox组件此时不能使用v-model
// 1、因为v-model在给子组件赋值的同时也会修改父组件的值，而当前组件中使用的XxxCheckbox控制是否选中的数据是来源于vuex，而vuex的数据只能通过mutations定义方法来修改
// 2、使用vuex控制的数据，如果需要双向数据绑定，那只能拆分v-model，如 当前组件使用的 XxxCheckbox 与 XxxNumber
// 3、vue3中v-model可以拆分为modelValue与@update:modelValue
// 4、Math.round(item.nowPrice * 100) * item.count / 100 是计算单个选中商品的金额时四舍五入保留两位小数
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
