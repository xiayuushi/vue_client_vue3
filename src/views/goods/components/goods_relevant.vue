<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{ goodsId ? '同类商品推荐' : '猜你喜欢' }}</span>
    </div>
    <!-- 此处使用改造后的xxx-carousel.vue -->
    <XxxCarousel :sliderList="relevantList" style="{ height: 380px }" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { goodsRelevant } from '@/api/product'

export default {
  name: 'GoodsRelevant',
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const relevantList = ref([])
    goodsRelevant({ id: props.goodsId }).then(res => {
      const pageSize = 4
      const pages = Math.ceil(res.result.length / pageSize)
      for (let i = 0; i < pages; i++) {
        relevantList.value.push(res.result.slice(i * pageSize, (i + 1) * pageSize))
      }
    })
    return { relevantList }
  }
}

// 1、该组件用于展示商品的同类推荐或者猜你喜欢（外界使用时传入商品Id则展示'同类推荐'，否则展示'猜你喜欢'）
// 2、因为轮播的是图片组成的列表，且每个列表有4个图片，会有多个列表存在，因此可以将数据定义成分页器的形式
// 3、pageSize是页容量 、服务器请求回来的数据res.result相当于是总条数、 pages是相应的页数
// 4、因为轮播列表是每页4条，而服务器返回的数据是[xxx,xxx,xxx,xxx,xxx,...]的形式，因此必须转成[[4条],[4条],[4条],[4条],...]的形式方便轮播图组件渲染列表
// 5、Array.slice(start, end) 用于截取源数组内的元素，并返回截取元素组成的新数组，其中截取的那个元素不包含end
// 6、Array1.push( Array2.slice() ) 表示截取某个数组的元素形成新的数组，并添加到另一个数组，例如 [[1,2,3,4],[5,6,7,8]]
</script>

<style lang='less' scoped>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}
:deep(.xxx-carousel) {
  height: 380px;
  .carousel-indicator {
    bottom: 30px;
    span {
      &.active {
        background: @xtxColor;
      }
    }
  }
  .carousel-btn {
      position: absolute;
      top: 100px;
      opacity: 0;
      color: #ddd;
      background: none;
      i {
        font-size: 30px;
      }
  }
}
</style>
