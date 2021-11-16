<template>
  <div class="goods-hot">
    <h3>{{ types[type] }}</h3>
    <div v-if="hotList">
      <GoodsItem v-for="item in hotList" :key="item.id" :goods="item" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { goodsHot } from '@/api/product'
import GoodsItem from '@/views/category/components/goods_item'

export default {
  name: 'GoodsHot',
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  components: { GoodsItem },
  setup (props) {
    const hotList = ref([])
    const route = useRoute()
    const { id } = route.params
    const types = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    goodsHot({ id, type: props.type }).then(res => (hotList.value = res.result))

    return { types, hotList }
  }
}
</script>

<style lang="less" scoped>
.goods-hot {
  h3 {
    height: 70px;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
    color: #fff;
    background: @helpColor;
  }
}
:deep(.goods-item) {
  background: #fff;
  width: 100%;
  margin-bottom: 10px;
  img {
    width: 200px;
    height: 200px;
  }
  p {
    margin: 0 10px;
  }
  &:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>
