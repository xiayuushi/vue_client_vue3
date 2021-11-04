<template>
   <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XxxBread>
        <XxxBreadItem to="/">首页</XxxBreadItem>
        <transition mode="out-in">
          <XxxBreadItem :key="topCategory.id">{{ topCategory.name }}</XxxBreadItem>
        </transition>
      </XxxBread>
      <!-- 轮播图 -->
      <XxxCarousel :sliderList="sliderList" autoplay  style="height:500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <router-link :to="`/category/sub/${ item.id }`">
              <img :src="item.picture" >
              <p>{{ item.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>- {{ sub.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XxxMore :path="`/category/sub/${ sub.id }`" />
        </div>
        <div class="body">
          <GoodsItem v-for="v in sub.goods" :key="v.id" :goods="v" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { homeBanner } from '@/api/home'
import { getCategory } from '@/api/category'
import GoodsItem from './components/goods_item'

export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup () {
    const sliderList = ref([])
    homeBanner().then(res => (sliderList.value = res.result))

    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      let temp = {}
      const curCate = store.state.category.list.find(item => (item.id === route.params.id))
      curCate && (temp = curCate)
      return temp
    })

    const subList = ref([])
    const getSubList = () => {
      getCategory(route.params.id).then(res => (subList.value = res.result.children))
    }
    watch(() => route.params.id, c => {
      if (c && route.path === `/category/${c}`) getSubList()
    }, { immediate: true })

    return { sliderList, topCategory, subList }
  }
}
// 1、topCategory是一级类目，用于渲染一级类目的面包屑数据，正因为只需要渲染首页到一级类目的面包屑，因此此处只需find遍历即可
// 2、当前一级分类的信息，需要依据动态路由传入的id与存储于vuex的分类数据做匹配才能确定
// 3、可以直接在计算属性内部做预判，定义temp空对象并返回，当匹配成功将匹配值赋值给temp，如此一来就可以省去在标签中进行v-if的条件判断渲染
// 4、vue3的watch侦听器，如果监听的是对象中的某个属性，第一参数必须是函数返回的形式，第二参数是回调，形参c是当前值（此处就是最新的动态路由传递的id）
// 5、watch监听到动态路由变化就调用接口获取二级类目商品，即 c && getSubList(c) 其中形参c是watch监听的最新的动态路由传参中的类目 id
// 6、warch监听到变化，即回调第一形参c有值，且请求有id（且这个id是一级类目的才去触发请求）则发送请求才不会报错，否则跳转到非一级类目却调用一级类目请求接口会报错
// 7、确定当前是否在一级类目，可以由路由信息route.path与 浏览器中的路径 `/category/${c}` 进行匹配，匹配一致则当前为第一类目
// 8、transition或transition-group标签不设置name属性 默认就是以'.v-'作为css的类样式前缀
// 9、当不适宜为标签设置v-if或v-show时，又想通过transition标签对其进行动画处理，则可以给需要做动画的标签设置 动态key属性（vue会重新创建虚拟节点更新dom）
</script>

<style lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
   .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
  // transition不设置name 默认就是.v-作为css的样式前缀
  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  .v-enter-active,
  .v-leave-active {
    transition: all .6s;
  }
  .v-enter-to,
  .v-leave-from {
    opacity: 1;
    transform: none;
  }
}
</style>
