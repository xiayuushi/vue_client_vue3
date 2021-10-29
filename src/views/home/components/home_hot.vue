<template>
  <div class="home-hot">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <!-- 替换默认插槽 -->
     <ul ref="pannel" class="goods-list">
      <li v-for="item in goodsList" :key="item.id">
        <RouterLink to="/">
          <img :src="item.picture" alt="">
          <p class="name">{{item.title}}</p>
          <p class="desc">{{item.alt}}</p>
        </RouterLink>
      </li>
    </ul>
    </HomePanel>
  </div>
</template>

<script>
import { ref } from 'vue'
import { homeHot } from '@/api/home'
import HomePanel from './home_panel'

export default {
  name: 'HomeHot',
  components: { HomePanel },
  setup () {
    const goodsList = ref([])
    homeHot().then(res => (goodsList.value = res.result))
    return { goodsList }
  }
}
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
