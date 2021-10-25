<template>
  <div>
    <nav>顶部通栏</nav>
    <header>头部</header>
    <!-- 二级路由的容器 -->
    <div class="main">
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>
    <footer>底部</footer>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
// 1、Layout是一级路由的布局容器，有顶部通栏、头部、主要内容区（二级路由容器）、底部
// 2、Layout是一级路由的布局容器，它的路由出口放在App.vue
// 3、一级路由容器嵌套二级路由容器(Layout.vue组件嵌套Home.vue)、二级路由容器嵌套三级路由容器(Home.vue嵌套)
// 4、相应的路由配置中，Layout是一级路由，它的children是二级路由Home
</script>

<style></style>
