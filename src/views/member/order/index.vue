<template>
  <div class="member-order-page">
    <XxxTabs v-model="activeName">
      <XxxTabsPanel v-for="item in orderStatusList" :key="item.name" :label="item.label" :name="item.name">{{ item.label }}</XxxTabsPanel>
    </XxxTabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import { orderStatusList } from '@/api/contant'

export default {
  name: 'OrderPage',
  setup () {
    const activeName = ref('all')
    return { activeName, orderStatusList }
  }
}
</script>

<style lang="less" scoped>
.member-order-page {
  height: 100%;
  background-color: #fff;
}
</style>
