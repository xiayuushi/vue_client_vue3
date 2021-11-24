<template>
  <div class="xxx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XxxBread>
        <XxxBreadItem to="/">首页</XxxBreadItem>
        <XxxBreadItem :to="`/category/${ goods.categories[1].id }`" v-if="goods.categories">{{ goods.categories[1].name }}</XxxBreadItem>
        <XxxBreadItem :to="`/category/sub/${ goods.categories[0].id }`" v-if="goods.categories">{{ goods.categories[0].name }}</XxxBreadItem>
        <XxxBreadItem>{{ goods.name }}</XxxBreadItem>
      </XxxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
          <GoodsSku :goods="goods" skuid="1369155865461919746" @change="acceptPayload" />
          <XxxNumbox v-model="num" label="数量" :max="goods.inventory" />
          <XxxButton type="primary" style="margin-top: 20px" @click="insertCart">加入购物车</XxxButton>
        </div>
      </div>
      <!-- 商品推荐 | 猜你喜欢-->
      <GoodsRelevant :goods-id="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
          <GoodsHot :type="3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, watch, nextTick, provide } from 'vue'
import { findGoods } from '@/api/product'
import GoodsImage from './components/goods_image'
import GoodsSales from './components/goods_sales'
import GoodsName from './components/goods_name'
import GoodsSku from './components/goods_sku'
import GoodsRelevant from './components/goods_relevant'
import GoodsTabs from './components/goods_tabs'
import GoodsHot from './components/goods_hot'
import GoodsWarn from './components/goods_warn'
import Message from '@/library/Message/index.js'

const getGoods = () => {
  const goods = ref(null)
  const route = useRoute()

  watch(() => route.params.id, c => {
    if (c && route.path === `/product/${c}`) {
      findGoods(route.params.id).then(({ result }) => {
        goods.value = null
        nextTick(() => (goods.value = result))
      })
    }
  }, { immediate: true })

  return goods
}

export default {
  name: 'GoodsPage',
  components: { GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsRelevant, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    const goods = getGoods()
    const acceptPayload = sku => {
      if (sku.skuid) {
        goods.value.oldPrice = sku.oldPrice
        goods.value.price = sku.price
        goods.value.inventory = sku.inventory
      }
      currentSku.value = sku
    }
    const num = ref(1)
    provide('goods', goods)

    const store = useStore()
    const currentSku = ref(null)
    const insertCart = () => {
      if (currentSku.value && currentSku.value.skuid) {
        console.log(1234)
        store.dispatch('cart/insertCart', {
          selected: true,
          isEffective: true,
          count: num.value,
          id: goods.value.id,
          name: goods.value.name,
          picture: goods.value.mainPictures[0],
          skuId: currentSku.value.skuid,
          price: currentSku.value.price,
          nowPrice: currentSku.value.price,
          stock: currentSku.value.inventory,
          attrsText: currentSku.value.specsText
        }).then(() => Message({ type: 'success', text: '添加购物车成功' }))
      } else {
        Message({ text: '请选择完整的规格' })
      }
    }

    return { goods, acceptPayload, num, insertCart }
  }
}

// 1、避免setup中逻辑过多，可以在"export default {}"的外部，script标签之内定义函数，然后在setup内执行
// 2、路由中id出现变化，但组件不会重新初始化，因此需要watch监听路由id以便重新调用接口更新数据驱动视图组件更新
// 3、同时使用两句不同的代码为同一个数据赋值，通常后面书写的代码会覆盖前面书写的，导致前面书写的代码几乎没有作用
// 3、goods.value = null;  goods.value = result; 此时前者机会不会生效
// 3、在vue中可以通过nextTick()来让两者生效，尤其该数据如果用于控制v-if或v-show时，会有意想不到的效果（可以参考静默刷新）
// 3、goods.value = null; nextTick(() => (goods.value = result)) 当组件中以goods这个数据作为v-if的判断条件时，goods数据更新时会重新初始化该组件
// 4、vue3中必须将nextTick从vue中导入后才能使用，这点与ref、watch类似
// 5、getGoods函数用于获取商品详情数据，注意不要在watch第二参数回调函数体内return接口返回的数据，否则面包屑渲染时拿不到插槽中的节点内容（文字）
// 6、acceptPayload用于接收goods_sku组件传递过来的用户已选的sku数据，并根据选择的sku修改原价现价库存等
// 7、provide()可以将数据传递给后代组件使用，例如 provide('key', key对应的value)
// 7、子组件及孙组件能通过inject()接收并使用该数据， 例如 inject('key') 就可以获取到value
// 8、此处如果不使用provide传递商品数据，使用props传递的话，必须传递两次（先传给子组件goods_tabs.vue再传递给子组件的子组件goods_detail.vue）
// 9、必须选择完整的商品规格后才能加入购物车, currentSku用于记录选择后的sku，当currentSku存在且有值时表示选择的sku商品规格是完整的，此时就可以进行添加购物操作
// 10、需要约定添加到购物车的每个商品对象需要哪些数据字段，必须与添加购物车接口返回的数据字段保持一致
// 10、例如：id, skuId, name, attrsText, picture, price, nowPrice, selected, stock, count, isEffective
// 11、insertCart函数内store.dispatch()之所以能够.then()是因为在vuex中实例化Promise处理过vuex的actions中的insertCart方法
</script>

<style lang="less" scoped>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
