<template>
    <div class="goods-tabs">
    <nav>
      <a :class="{ active: componentName === 'GoodsDetail' }" href="javascript:;" @click="componentName='GoodsDetail'">商品详情</a>
      <a :class="{ active: componentName === 'GoodsComment' }" href="javascript:;" @click="componentName='GoodsComment'">商品评价<span>(500+)</span></a>
    </nav>
    <!-- 切换内容的地方 -->
    <component :is="componentName"></component>
  </div>
</template>

<script>
import { ref } from 'vue'
import GoodsDetail from './goods_detail'
import GoodsComment from './goods_comment'

export default {
  name: 'Goods_tabs',
  components: { GoodsDetail, GoodsComment },
  setup () {
    const componentName = ref('GoodsDetail')
    return { componentName }
  }
}

// 1、component动态组件，会根据is属性的组件名去加载对应的组件
// 2、此处 <component :is='组件名变量' /> 等同于 <组件名 v-if="componentName==='组件名'" />
// 3、动态组件通常会配合异步组件一起使用，但在此处不能像vue2那样直接通过 const xxx = () => import('./xxx')的方式导入异步组件，否则会报错
// 4、如果需要缓存组件，则可以在component之外加一个keep-alive，例如：<keep-alive><component :is="componentName" /></keep-alive>
// 5、tab页组件做评论组件与其他组件时，想继续翻看切换tab页之前的评论组件，不想从新开始从第一条评论阅读，则可以考虑将评论组件使用<keep-alive>包裹一层进行组件缓存
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
