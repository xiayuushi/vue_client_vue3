<template>
  <div class="test-container">我的订单
    <router-link to="/member/test1">测试1</router-link>
    <router-link to="/member/test2">测试2</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MyOrderPage'
}
</script>

<style lang="less" scoped>
.test-container {
  width: 1000px;
  min-height: 800px;
  a {
    &.active {
      color: #f00;
    }
  }
}
</style>
