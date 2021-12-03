<template>
  <XxxTabs>
    <XxxTabsPanel label="选项1" name="1">内容1</XxxTabsPanel>
    <XxxTabsPanel v-for="i in 8" :key="i" :label="`选项${i}`" :name="`${i}`">内容{{i}}</XxxTabsPanel>
  </XxxTabs>
</template>

<script>
export default {

}
</script>

<style>

</style>
