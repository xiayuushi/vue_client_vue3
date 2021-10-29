<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner />
        <!-- 新鲜好物 -->
        <HomeNew />
        <!-- 热门推荐 -->
        <HomeHot />
      </div>
    </div>
  </div>
</template>
<script>
import HomeCategory from './components/home_category'
import HomeBanner from './components/home_banner'
import HomeNew from './components/home_new'
import HomeHot from './components/home_hot'
export default {
  name: 'PageHome',
  components: { HomeCategory, HomeBanner, HomeNew, HomeHot }
}
</script>
<style scoped lang="less"></style>
