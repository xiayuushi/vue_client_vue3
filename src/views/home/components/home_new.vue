<template>
  <div class="home-new" ref="target">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <!-- 替换右上角具名插槽 #right -->
      <template #right>
        <XxxMore path="/" />
      </template>
      <!-- 替换默认插槽 -->
      <transition name="fade">
        <ul class="goods-list" v-if="goodsList">
          <li v-for="item in goodsList" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton bg="#f0f9f4" v-else />
      </transition>
    </HomePanel>
  </div>
</template>

<script>
import { ref } from 'vue'
import { homeNew } from '@/api/home'
import { dataLazyLoad } from '@/hooks'
import HomePanel from './home_panel'
import HomeSkeleton from './home_skeleton'

export default {
  components: { HomePanel, HomeSkeleton },
  setup () {
    const target = ref(null)
    return { goodsList: dataLazyLoad(target, homeNew), target }
  }
}

// 1、ref通常用于定义简单类型的响应式数据，当然也可以定义未知类型的响应式数据，定义数组也可以
// 2、一般只有明确键值对的响应式对象才会使用reactive定义

// 3、数据未回来之前，启用面板骨架组件渲染，且使用transition做动画过渡处理
// 4、transition标签的name属性就是 动画过渡的css前缀，此处是.fade 则必须定义.fade类前缀样式 才能会有相应的动画过渡效果
// 5、因为考虑到会多处用到面板骨架屏效果，因此将 .fade样式 放入到全局通用样式 assets/common.less中了
// 6、因为做了数据懒加载（可视区加载），因此将原先直接通过api请求数据，改成使用封装好的懒加载函数dataLazyLoad来请求数据
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
