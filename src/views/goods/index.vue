<template>
  <div class='xxx-goods-page'>
    <div class="container">
      <!-- 面包屑 -->
      <XxxBread>
        <XxxBreadItem to="/">首页</XxxBreadItem>
        <XxxBreadItem to="/">手机</XxxBreadItem>
        <XxxBreadItem to="/">华为</XxxBreadItem>
        <XxxBreadItem to="/">p30</XxxBreadItem>
      </XxxBread>
      <!-- 商品信息 -->
      <div class="goods-info"></div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods_relevant'

export default {
  name: 'XxxGoodsPage',
  components: { GoodsRelevant }
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
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
