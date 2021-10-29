<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <!-- 替换右上角具名插槽 #right -->
      <template #right>
        <XxxMore path="/" />
        </template>
      <!-- 替换默认插槽 -->
        <ul class="goods-list">
          <li v-for="item in goodsList" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
    </HomePanel>
  </div>
</template>

<script>
import { ref } from 'vue'
import { homeNew } from '@/api/home'
import HomePanel from './home_panel'

export default {
  components: { HomePanel },
  setup () {
    const goodsList = ref([])
    homeNew().then(res => (goodsList.value = res.result))
    console.log(goodsList)
    return { goodsList }
  }
}
</script>

<style lang="less" scoped>
  .goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
