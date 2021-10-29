<template>
  <div class='home-skeleton'>
    <div class="item" v-for="i in 4" :key="i" :style="{backgroundColor:bg}">
      <XxxSkeleton bg="#e4e4e4" width="306px" height="306px" animated />
      <XxxSkeleton bg="#e4e4e4" width="160px" height="24px" animated />
      <XxxSkeleton bg="#e4e4e4" width="120px" height="24px" animated />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSkeleton',
  props: {
    bg: {
      type: String,
      default: '#fff'
    }
  }
}
// 1、当前组件是首页模块面板组件的骨架屏效果
</script>

<style lang="less" scoped>
.home-skeleton {
  width: 1240px;
  height: 406px;
  display: flex;
  justify-content: space-between;
  .item {
    width: 306px;
    .xxx-skeleton ~ .xxx-skeleton{
      display: block;
      margin: 16px auto 0;
    }
  }
}
</style>
