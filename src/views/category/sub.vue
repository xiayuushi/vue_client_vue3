<template>
  <div class="container">
    <!-- 二级分类面包屑 -->
    <SubBread />
    <!-- 二级分类筛选区 -->
    <SubFilter />
  </div>
</template>

<script>
import SubBread from './components/sub_bread'
import SubFilter from './components/sub_filter'

export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter }
}
</script>

<style>

</style>
