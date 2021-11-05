<template>
  <div class="container">
    <!-- 二级分类面包屑 -->
    <SubBread />
    <!-- 二级分类筛选区 -->
    <SubFilter @filterChangeEvent="filterChangeEvent" />
    <!-- 二级分类筛选结果 -->
    <div class="goods-list">
      <!-- 排序 -->
      <SubSort @sortChangeEvent="sortChangeEvent" />
      <!-- 筛选结果列表（符合筛选结果的商品列表） -->
      <ul><li v-for="item in goodsList" :key="item"><GoodsItem :goods="item" /></li></ul>
      <!-- 无限加载 -->
      <XxxInfiniteLoading :isLoading="isLoading" :isFinished="isFinished" @onLoad="onLoad" />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categoryGoodsTemporary } from '@/api/category'

import SubBread from './components/sub_bread'
import SubFilter from './components/sub_filter'
import SubSort from './components/sub_sort'
import GoodsItem from './components/goods_item'
import XxxInfiniteLoading from '@/library/Infinite'

export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem, XxxInfiniteLoading },
  setup () {
    const route = useRoute()
    const goodsList = ref([])
    const isLoading = ref(false)
    const isFinished = ref(false)
    let params = {
      categoryId: route.params.id,
      page: 1,
      pagsize: 20
    }

    const onLoad = () => {
      categoryGoodsTemporary(params).then(({ result }) => {
        if (result.items.length) {
          goodsList.value = [...goodsList.value, ...result.items]
          params.page++
        } else {
          isFinished.value = true
        }
        isLoading.value = false
      })
    }

    watch(() => route.params.id, c => {
      if (c && route.path === `/category/sub/${c}`) {
        goodsList.value = []
        params = {
          categoryId: c,
          page: 1,
          pagsize: 20
        }
        isLoading.value = false
        isFinished.value = false
      }
    }, {
      immediate: true
    })

    const sortChangeEvent = sortParams => {
      params = { ...params, ...sortParams }
      params.page = 1
      goodsList.value = []
      isLoading.value = false
      isFinished.value = false
    }

    const filterChangeEvent = filterParams => {
      params = { ...params, ...filterParams }
      params.page = 1
      goodsList.value = []
      isLoading.value = false
      isFinished.value = false
    }

    return { isLoading, isFinished, onLoad, goodsList, sortChangeEvent, filterChangeEvent }
  }
}

// 1、无限加载做的是数据拼接，goodsList.value = [...goodsList.value, ...result.items]也可以直接写成 goodsList.value.push(...result.items)
// 2、如果返回数组不为空，说明还有数据，此时需要页码加1，继续将请求回来的商品数据添加加入到商品数组列表中渲染
// 3、如果返回数组为空，说明数据已经加载完毕，此时必须将isFinished状态置为true（让无限加载停止）
// 4、数据加载完毕或者请求完成，都必须将isLoading置为false
// 5、当切换到其他二级类目时，应该清空渲染数组以及重置无限加载的数据（类目id、页码、加载状态、加载完成状态），因此需要监听二级类目的路由变化
// 6、当渲染数组被清空后，因为没有数据渲染，此时做可视区的dom会自动"上移"进入可视区范围，从而触发@onLoad进行无限加载，因此无需在watch中手动调用接口（只需变更接口参数即可，后续的排序或筛选渲染商品列表的逻辑类似）
// 7、SubSort标签中通过实现@sortChangeEvent接收子组件sub_sort.vue传递的参数，用于重置排序后合并参数发请求（无需手动发请求，只要进入可视区范围会自动触发无限加载组件的@onLoad进行接口请求）
// 8、当前组件的sortChangeEvent中的形参sortParams，可以接收到子组件sub_sort.vue中点击排序或者复选框时触发sortChange事件时，emit()传递的@sortChangeEvent事件传递过来的参数
// 9、当前组件的filterChangeEvent中的形参filterParams，可以接收到子组件sub_sort.vue中点击二级分类筛选时触发changeBrand或changeProp事件时，emit()传递的@filterChangeEvent事件传递过来的参数
// 10、当进入可视区（触发无限加载组件onLoad事件后）会自动发请求，因此无需手动调用接口发请求，只需要合并子组件传递过来的，接口需要的参数、清空商品列表数组、重置页码为1、重置isFinished与isLoading即可

</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
