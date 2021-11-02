<template>
  <div class="sub-bread">
    <XxxBread>
      <XxxBreadItem to="/">首页</XxxBreadItem>
      <XxxBreadItem :to="`/category/${allCategory.category.id}`">{{ allCategory.category.name }}</XxxBreadItem>
      <XxxBreadItem :to="`/category/sub/${allCategory.sub.id}`">{{ allCategory.sub.name }}</XxxBreadItem>
    </XxxBread>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'SubBread',
  setup () {
    const store = useStore()
    const route = useRoute()
    const allCategory = computed(() => {
      const temp = {}
      store.state.category.list.forEach(item => {
        if (item.children) {
          const curSubCate = item.children.find(v => v.id === route.params.id)
          if (curSubCate) {
            temp.category = { id: item.id, name: item.name }
            temp.sub = { id: curSubCate.id, name: curSubCate.name }
          }
        }
      })
      return temp
    })
    return { allCategory }
  }
}
// 1、此组件是二级类目的面包屑，数据需要用到'首页 > 一级类目category > 二级类目sub' 的数据，因此必须整合一级类目与二级类目的数据（即 allCategory）
// 2、整合后的数据allCategory: { category: {id:xxx, name:'一级类目'}, sub:{id:xxx, name:'二级类目' } }
// 3、在当前（二级类目）组件中获取 route.params.id 是二级类目的路由信息，（例如：/category/sub/1000）
// 4、forEach中形参item就是一级类目category的每一项，而sub是一级类目对应下的二级类目
// 5、因为计算属性内部定义了对象temp并返回，因此无论temp是否有属性，它都不会报错，从而可以在标签中省略v-if做非空渲染判断
</script>

<style>

</style>
