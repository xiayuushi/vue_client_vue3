<template>
  <div class="home-hot" ref="target">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <!-- 替换默认插槽 -->
    <transition name="fade">
      <ul ref="pannel" class="goods-list" v-if="goodsList">
        <li v-for="item in goodsList" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" alt="">
            <p class="name">{{item.title}}</p>
            <p class="desc">{{item.alt}}</p>
          </RouterLink>
        </li>
      </ul>
      <HomeSkeleton v-else />
    </transition>
    </HomePanel>
  </div>
</template>

<script>
import { homeHot } from '@/api/home'
import HomePanel from './home_panel'
import HomeSkeleton from './home_skeleton'
import { dataLazyLoad } from '@/hooks'

export default {
  name: 'HomeHot',
  components: { HomePanel, HomeSkeleton },
  setup () {
    const { data, target } = dataLazyLoad(homeHot)
    return { goodsList: data, target }
  }
}

// 1、因为做了数据懒加载（可视区加载），因此将原先直接通过api请求数据，改成使用封装好的懒加载函数dataLazyLoad来请求数据
// 1、原先：homeHot().then(res => (goodsList.value = res.result)) 此时：dataLazyLoad(DOM, homeHot)
// 2、使用封装好的懒加载函数必须先取到监听进入可视区的DOM
// 3、dataLazyLoad函数，参数传入请求api，将请求结果data赋值给预先定义好的请求数据goodsList，而target是封装好的用于绑定监听可视区的dom

</script>

<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
