<template>
  <div class="home-banner">
    <XxxCarousel :slider-list="sliderList" autoplay></XxxCarousel>
  </div>
</template>

<script>
import { ref } from 'vue'
import { homeBanner } from '@/api/home'
export default {
  name: 'HomeBanner',
  setup () {
    const sliderList = ref([])
    homeBanner().then(res => (sliderList.value = res.result))

    return { sliderList }
  }
}
</script>

<style lang="less" scoped>
.home-banner {
  position: absolute;
  left: 0;
  top: 0;
  width: 1240px;
  height: 500px;
  ::v-deep .carousel-btn.prev {
    left: 270px;
  }
  /deep/ .carousel-indicator {
    padding-left: 250px;
  }
  // 1、less 中既可以使用 ::v-deep 也可以使用/deep/作为深度选择器选取组件生成的内部元素
  // 2、scss 中只能使用 ::v-deep
  // 3、首页左侧分类底部的轮播图比较特殊，因此需要覆盖掉通用样式轮播图中的样式 必须使用深度选择器进行覆盖样式
  // 4、在封装公共轮播图样式时，并没有写死width与height就是为了后续更改覆盖方便
  // 5、使用轮播图时外部加个盒子套住轮播图，再对这个外部盒子设置宽高即可，对于细节处理，可以采取深度选择器进行样式覆盖
}
</style>
