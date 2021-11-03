<template>
  <div class="container">
    <!-- 二级分类面包屑 -->
    <SubBread />
    <!-- 二级分类筛选区 -->
    <SubFilter />
    <!-- 二级分类 -->
    <div class="goods-list">
      <SubSort />
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub_bread'
import SubFilter from './components/sub_filter'
import SubSort from './components/sub_sort'

export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort },
  setup () { }
}
</script>

<style>

</style>
