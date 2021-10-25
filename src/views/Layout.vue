<template>
  <div>
    <AppTopnav></AppTopnav>
    <AppHeader>头部</AppHeader>
    <!-- 二级路由的容器 -->
    <div class="app-body">
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'Layout',
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
    return { }
  }
}
// 1、Layout是一级路由的布局容器，有顶部通栏、头部、主要内容区（二级路由容器）、底部
// 2、Layout是一级路由的布局容器，它的路由出口放在App.vue
// 3、一级路由容器嵌套二级路由容器(Layout.vue组件嵌套Home.vue)、二级路由容器嵌套三级路由容器(Home.vue嵌套)
// 4、相应的路由配置中，Layout是一级路由，它的children是二级路由Home
// 5、layout组件是一级路由的容器，一级路由中多个页面都用到了同一份接口数据因此，在此处调用接口可以让容器下的多个一级路由组件都共享一份数据，避免在不同组件多次调用
</script>

<style lang="less" scoped>
.app-body {
  min-height: 800px;
}
</style>
