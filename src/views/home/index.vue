<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner />
        <!-- 面板 -->
        <HomePanel />
      </div>
    </div>
  </div>
</template>
<script>
import HomeCategory from './components/home_category'
import HomeBanner from './components/home_banner'
import HomePanel from './components/home_panel'
export default {
  name: 'PageHome',
  components: { HomeCategory, HomeBanner, HomePanel }
}
</script>
<style scoped lang="less"></style>
