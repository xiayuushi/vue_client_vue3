<template>
  <RouterLink :to="`/product/${goods.id}`" class='goods-item'>
    <img :src="goods.picture" alt="">
    <p class="name ellipsis">{{ goods.name }}</p>
    <p class="desc ellipsis">{{ goods.desc }}</p>
    <p class="price">&yen;{{ goods.price }}</p>
  </RouterLink>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    }
  }
}
// 1、当前组件为二级类目中的一个商品信息面板，因为二级类目中的商品信息的布局都是一样的，因此提前封装以便复用
// 2、相同的布局，不同的数据，都可以封装为一个组件，而不同的数据可以通过提供props参数让外界传入
</script>

<style scoped lang='less'>
.goods-item {
  display: block;
  width: 220px;
  padding: 20px 30px;
  text-align: center;
  .hoverShadow();
  img {
    width: 160px;
    height: 160px;
  }
  p {
    padding-top: 10px;
  }
  .name {
    font-size: 16px;
  }
  .desc {
    color: #999;
    height: 29px;
  }
  .price {
    color: @priceColor;
    font-size: 20px;
  }
}
</style>
