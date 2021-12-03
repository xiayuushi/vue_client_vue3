<template>
  <XxxTabs v-model="activeName" @tab-click="tabClickHandler">
    <XxxTabsPanel label="选项" name="标识">内容</XxxTabsPanel>
    <XxxTabsPanel v-for="i in 8" :key="i" :label="`选项${i}`" :name="`${i}`">内容{{i}}</XxxTabsPanel>
  </XxxTabs>
</template>

<script>
import { ref, provide } from 'vue'

export default {
  name: 'Test1',
  setup () {
    const activeName = ref('6')
    provide('activeName', activeName)

    const tabClickHandler = (params) => {
      console.log(params)
    }
    return { activeName, tabClickHandler }
  }
}

// 1、封装tabs组件，在生成tabs-item时需要考虑两种情况，直接静态生成的，以及动态v-for遍历生成的情况
// 2、params是父级暴露的方法，params.name是当前点击项唯一标识，params.index是当前点击项索引
</script>

<style>

</style>
