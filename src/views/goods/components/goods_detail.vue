<template>
  <div class="goods-detail">
    <!-- 属性 -->
    <ul class="attrs">
      <li v-for="item in goods.details.properties" :key="item.name">
        <span class="dt">{{ item.name }}</span>
        <span class="dd">{{ item.value }}</span>
      </li>
    </ul>
    <!-- 图片 -->
    <img v-for="item in goods.details.pictures" :key="item" :src="item" alt="">
  </div>
</template>
<script>
import { inject } from 'vue'

export default {
  name: 'GoodsDetail',
  setup () {
    const goods = inject('goods')
    return { goods }
  }
}

// 1、祖级组件使用provide('goods',xxx)传递数据xxx
// 2、后代组件使用inject('goods')接收传递的数据xxx
// 3、只需要在祖级组件provide()传递一次，每个后代组件都通过inject()都能够接收到传递数据，无需通过繁琐的props属性层层传递
// 4、provide()适用于祖级与后代组件关系（包含父子组件）之间传参
// 5、如果传递的数据是响应式的依旧需要通过'.value'的方式取响应式的值
</script>

<style lang="less" scoped>
.goods-detail {
  padding: 40px;
  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;
      .dt {
        width: 100px;
        color: #999;
      }
      .dd {
        flex: 1;
        color: #666;
      }
    }
  }
  > img {
    width: 100%;
  }
}
</style>
