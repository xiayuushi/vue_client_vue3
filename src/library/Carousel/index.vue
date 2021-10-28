<template>
  <!-- 整体轮播图区域盒子 -->
  <div class="xxx-carousel" @mouseenter="stopAutoPlay" @mouseleave="restartAutoPlay">
    <ul class="carousel-body">
      <!-- 图片 -->
      <li class="carousel-item" :class="{fade: currentIndex===index}" v-for="(item, index) in sliderList" :key="index">
        <router-link :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </router-link>
      </li>
    </ul>
    <!-- 左右切换按钮 -->
    <a href="javascript:void(0);" class="carousel-btn prev" @click="toggleCarousel(-1)"><i class="iconfont icon-angle-left"></i></a>
    <a href="javascript:void(0);" class="carousel-btn next" @click="toggleCarousel(+1)"><i class="iconfont icon-angle-right"></i></a>
    <!-- 下方索引指示器 -->
    <div class="carousel-indicator">
      <span v-for="(item, index) in sliderList" :key="index" :class="{active: currentIndex===index}" @click="currentIndex = index"></span>
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'

export default {
  name: 'XxxCarousel',
  props: {
    sliderList: {
      type: Array,
      default: () => []
    },
    duration: {
      type: Number,
      default: 3000
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    let timer = null
    const currentIndex = ref(0)

    const autoplayfn = () => {
      clearInterval(timer)
      timer = setInterval(() => {
        currentIndex.value++
        if (currentIndex.value >= props.sliderList.length) {
          currentIndex.value = 0
        }
      }, props.duration)
    }

    watch(() => props.sliderList, (currentVal, oldVal) => {
      if (currentVal.length && props.autoplay) {
        autoplayfn()
      }
    }, {
      immediate: true
    })

    const stopAutoPlay = () => {
      if (timer) clearInterval(timer)
    }
    const restartAutoPlay = () => {
      if (props.sliderList.length && props.autoplay) {
        autoplayfn()
      }
    }

    const toggleCarousel = (step) => {
      const _currentIndex = currentIndex.value + step
      if (_currentIndex > props.sliderList.length - 1) {
        currentIndex.value = 0
        return
      }
      if (_currentIndex < 0) {
        currentIndex.value = props.sliderList.length - 1
        return
      }
      currentIndex.value = _currentIndex
    }

    onUnmounted(() => clearInterval(timer))

    return { currentIndex, stopAutoPlay, restartAutoPlay, toggleCarousel }
  }
}
// 1、使用该公有组件，需要外界传入3个参数：sliderList（轮播图数据）、duration（轮播间隔）、autoplay（是否自动轮播）
// 2、无论是ui库中的轮播图或者是自己封装的轮播图，一般都会有以上几个参数
// 3、因为封装的是公有组件，因此不应该在此处调用接口，应该在使用该公有组件的地方去调用接口
// 4、如果在此处调用某个接口获取轮播图渲染，则相当于是写死了这个轮播图只能渲染这个接口的图片
// 5、默认情况下没有.fade轮播图不会显示， 当为li添加.fade时则会显示轮播图，需要配合索引指定的某一张显示
// 6、指示器span的.active类，表示当前激活的点，索引与被选中的那张轮播图一样
// 7、侦听到轮播图有数据时，且外界传入autoplay时，才会调用自动轮播的函数进行轮播
// 8、vue3的侦听器，如果是监听属性变化，必须以函数回调的形式传入被监听属性，此处轮播图数据需要从props中取，因此监听props.sliderList也必须是回调传入
</script>

<style lang="less" scoped>
.xxx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      // 显示图片
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        // span之后的兄弟span标签
        ~ span {
          margin-left: 12px;
        }
        // 当前展示的轮播图索引
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
