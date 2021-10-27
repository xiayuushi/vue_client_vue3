<template>
  <div class="xxx-skeleton" :style="{ width, height }" :class="{ shan: animated }">
    <div class="block" :style="{ backgroundColor: bg }"></div>
  </div>
</template>

<script>
export default {
  name: 'XxxSkeleton',
  props: {
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    },
    animated: {
      type: Boolean,
      default: false
    },
    bg: {
      type: String,
      default: null
    }
  }
}

// 1、该组件是自定义的骨架屏，用于数据加载显示前的占位
// 2、该组件使用时需要外界传入width（宽度）、height（高度）、bg（背景色）、animated（是否动画，传入则开启动画）
// 3、此处是自定义封装的插件组件，为了后续方便辨别自定义封装组件与ui库中的组件，使用时以 xxx-name的形式定义name属性，后续以xxx-name使用即可

// 4、xxx-skeleton整体包裹容器（父相）必须设置行内块，让骨架屏与需要骨架屏的元素一行显示
// 5、xxx-skeleton是行内块元素inline-block需要清除行内块默认下边距，与需要骨架屏的元素 同一行显示
// 6、shan闪动效果是 xxx-skeleton的伪元素来做的
// 7、@keyframes 定义动画
// 8、需要做动画的元素必须调用动画名称才会执行
</script>

<style lang="less" scoped>
.xxx-skeleton {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  .block {
    width: 100%;
    height: 100%;
    border-radius: 2px;
  }
}
.shan {
  &::after {
    position: absolute;
    content: '';
    top: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skew(-45deg);
    animation: move 1.2s ease 0s infinite;
  }
}
@keyframes move {
  0% {
    left: -100%;
    opacity: .2;
  }
  100% {
    left: 120%;
    opacity: 1;
  }
}
</style>
