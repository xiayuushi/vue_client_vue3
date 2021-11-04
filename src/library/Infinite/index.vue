<template>
  <div class="xxx-infinite-loading" ref="target">
    <div class="loading" v-if="isLoading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="isFinished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export default {
  name: 'XxxInfiniteLoading',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    isFinished: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const target = ref(null)
    useIntersectionObserver(target, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if (!props.isLoading && !props.isFinished) {
          emit('onLoad')
        }
      }
    }, {
      threshold: 0
    })

    return { target }
  }
}
// 1、当前组件用于无限加载，接收外界传入的一个方法与两个属性 isLoading（是否加载中） isFinished（数据是否加载完成） @onLoad（加载事件）
// 2、触发无限加载的前提条件：1、isLoading必须为false 2、isFinished必须为false
// 2、数据不是正在加载以及数据未加载完成，这两个条件同时满足才会开启无限加载，触发@onLoad
// 3、使用可视区加载来完成无限加载，将无限加载组件放置于产品列表同级下方，当进入可视区加载范围时，如果满足两个条件就会开启无限加载
// 4、在vue3的组合API中可以使用@vueuse/core库中的useIntersectionObserver来实现无限加载
// 5、@vueuse/core库中的useIntersectionObserver用于可视区加载（可以做接口数据懒加载、无限加载、图片懒加载等功能）
// 6、在非组合API中可以使用原生的IntersectionObserver来实现可视区加载，@vueuse/core库中的useIntersectionObserver就是基于原生的IntersectionObserver来封装的
// 7、target是需要做可视区加载的dom
// 8、此处无限加载的封装参考了vant-ui中的上拉加载更多组件
</script>

<style lang="less" scoped>
.xxx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
