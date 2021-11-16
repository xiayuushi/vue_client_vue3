<template>
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{ commentInfo.salesCount }}</span><span>人购买</span></p>
        <p><span>{{ commentInfo.praisePercent }}%</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a href="javascript:;"
            :class="{ active: cIndex === index }"
            v-for="(item, index) in commentInfo.tags" :key="index"
            @click="currentClick(index)">
            {{ item.title }}（{{ item.tagCount }}）
          </a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a href="javascript:;" class="active">默认</a>
      <a href="javascript:;">最新</a>
      <a href="javascript:;">最热</a>
    </div>
    <div class="list"></div>
  </div>
</template>

<script>
import { inject, ref } from 'vue'
import { goodsEvaluate } from '@/api/product'

export default {
  name: 'GoodsComment',
  setup () {
    const commentInfo = ref(null)
    const cIndex = ref(0)
    const goods = inject('goods')
    goodsEvaluate(goods.value.id).then(res => {
      res.result.tags.unshift({ title: '有图', tagCount: res.result.hasPictureCount })
      res.result.tags.unshift({ title: '全部评价', tagCount: res.result.evaluateCount })
      commentInfo.value = res.result
    })

    const currentClick = index => (cIndex.value = index)
    return { commentInfo, currentClick, cIndex }
  }
}
// 1、此处获取商品id有两种方法：
// 1、方法1：使用inject获取祖级组件中provide()中传递的商品信息数据goods，通过该数据获取
// 1、方法2：通过动态路由 route.params.id 获取
// 2、评价组件中有'全部评价'与'有图评价'，但是接口数据中并没有这两个部分因此必须参考接口返回数据自行添加上这两个部分，然后组合数据后再用于页面数据渲染
</script>

<style lang="less" scoped>
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
