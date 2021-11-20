<template>
  <transition>
    <div class="xxx-message" :style="style[type]" v-show="show">
      <!-- 上面绑定的是样式 -->
      <!-- 不同提示图标会变 -->
      <i class="iconfont" :class="[style[type].icon]"></i>
      <span class="text">{{ text }}</span>
    </div>
  </transition>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'XxxMessage',
  props: {
    type: {
      type: String,
      default: 'warn'
    },
    text: {
      type: String,
      default: '提示文本'
    }
  },
  setup () {
    const show = ref(false)
    const style = {
      warn: {
        icon: 'icon-warning',
        color: '#E6A23C',
        backgroundColor: 'rgb(253, 246, 236)',
        borderColor: 'rgb(250, 236, 216)'
      },
      error: {
        icon: 'icon-shanchu',
        color: '#F56C6C',
        backgroundColor: 'rgb(254, 240, 240)',
        borderColor: 'rgb(253, 226, 226)'
      },
      success: {
        icon: 'icon-queren2',
        color: '#67C23A',
        backgroundColor: 'rgb(240, 249, 235)',
        borderColor: 'rgb(225, 243, 216)'
      }
    }
    onMounted(() => {
      show.value = true
    })

    return { style, show }
  }
}

// 1、因为不同的提示有不同的颜色及背景色，因此需要封装成完整样式（而不是:class="xxx"的方式仅添加某个icon的类）
// 1、st1 预先定义多个对象作为提示类型的样式 warn{ icon:'icon-warn', color: '#..'} }  default{ icon:'icon-default',color:'#..' }
// 1、st2 渲染时大容器时，给整体大容器盒子动态添加style样式（将不同提示类型的样式 平铺添加到大容器盒子样式中，成为大容器盒子样式的一部分）  即，.xxx-message { icon:'icon-warn', color: '#f00' //warn对象展开后平铺到此 }
// 1、st3 渲染i标签时，给i标签动态添加icon类（因为:class添加的只能是类名，而不是具体的样式）  即 class="iconfont" :class="icon-warn"  动态添加的类就是.xxx-message中warn对象的icon属性的值
// 1、总之，定义提示类型的样式、让提示类型的样式成为整体盒子容器样式的一部分、渲染i标签时取icon类名动态添加
// 2、因为提示类样式不同，因此将其以props.type暴露给外界，外界使用当前的封装组件时传入什么提示类型type，就渲染什么类型的提示

</script>

<style lang="less" scoped>
.xxx-message {
  width: 300px;
  height: 50px;
  position: fixed;
  z-index: 9999;
  left: 50%;
  margin-left: -150px;
  top: 25px;
  line-height: 50px;
  padding: 0 25px;
  border: 1px solid #e4e4e4;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;
  i {
    margin-right: 4px;
    vertical-align: middle;
  }
  .text {
    vertical-align: middle;
  }
}
// 消息提示框进入时的过渡动画效果
.v-enter-from {
  transform: translate3d(0,-75px,0);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s;
}
.v-enter-to {
  transform: none;
  opacity: 1;
}
</style>
