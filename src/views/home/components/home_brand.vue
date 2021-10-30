<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证" ref="target">
    <template #right>
      <a @click="togglePage(-1)" href="javascript:void(0);">
        <i class="iconfont icon-angle-left prev" :class="{disabled: index===0}"></i>
      </a>
      <a @click="togglePage(+1)" href="javascript:void(0);">
        <i class="iconfont icon-angle-right next" :class="{disabled: index===1}"></i>
      </a>
    </template>
    <div class="box" ref="box">
      <transition name="fade">
        <ul class="list" :style="{transform:`translateX(${-1240*index}px)`}" v-if="brandsList">
          <li v-for="item in brandsList" :key="item.id">
              <RouterLink to="/">
                <img v-lazy="item.picture" alt="">
              </RouterLink>
          </li>
        </ul>
        <div class="skeleton" v-else>
          <XxxSkeleton class="item" v-for="i in 5" :key="i" width="240px" height="305px" bg="#e4e4e4" animated />
        </div>
      </transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { homeBrand } from '@/api/home'
import { dataLazyLoad } from '@/hooks'
import HomePanel from './home_panel'

export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    const index = ref(0)
    const togglePage = step => {
      const currentIndex = index.value + step
      if (currentIndex < 0 || currentIndex > 1) return
      index.value = currentIndex
      console.log(currentIndex)
    }

    const { data, target } = dataLazyLoad(() => homeBrand(10))

    return { brandsList: data, target, togglePage, index }
  }
}
// 1、dataLazyLoad(homeBrand(10)) 会报错：request is not a function
// 1、原因：homeBrand(10)返回的是一个promise对象，而dataLazyLoad必须是传入函数，传参不符合要求会报错
// 1、解决：将接口请求通过箭头函数处理一下，再传入， 例如 dataLazyLoad( ()=>homeBrand(10) )
</script>

<style lang="less" scoped>
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  // 控制是否可以点击
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>
