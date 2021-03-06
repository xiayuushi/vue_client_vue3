<template>
  <div class="xxx-confirm" :class="{ fade }">
    <div class="wrapper" :class="{ fade }">
      <div class="header">
        <h3>{{ title }}</h3>
        <a href="JavaScript:;" class="iconfont icon-close-new" @click="cancel"></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{ text }}</span>
      </div>
      <div class="footer">
        <XxxButton size="mini" type="gray" @click="cancel">取消</XxxButton>
        <XxxButton size="mini" type="primary" @click="submit">确认</XxxButton>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import XxxButton from '../Button'

export default {
  name: 'XxxConfirm',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    text: {
      type: String,
      default: ''
    },
    cancelCallback: {
      type: Function
    },
    submitCallback: {
      type: Function
    }
  },
  components: { XxxButton },
  setup (props) {
    const fade = ref(false)
    onMounted(() => {
      setTimeout(() => (fade.value = true), 0)
    })
    const cancel = () => {
      props.cancelCallback()
    }
    const submit = () => {
      props.submitCallback()
    }

    return { fade, cancel, submit }
  }
}

// 1、如果提示"Failed to resolve component: XxxButton"则需要额外导入并注册XxxButton组件
// 1、因为XxxButton组件是挂载到vue实例上的（即生成的button组件dom是vue根容器#app容器下的元素）
// 1、而当前封装的组件如果是采用函数式调用，则生成的dom并非是vue的渲染容器#app的子元素（这点可以打开浏览器控制台查看）
// 1、因此需要在当前组件额外导入并注册XxxButton（它只是vue应用实例上的通用全局组件，但当前Confirm组件如果是函数式调用则无法享受Vue全局共享的'便利'）
// 2、submitCallback与cancelCallback函数是定义给Confirm.js模块的Promise对象使用的，定义好之后在当前组件中通过props点出调用
// 3、组合API(setup周期函数)中必须调用props.submitCallback()才能调用Confirm模块中Promise对象定义的submitCallback()销毁组件，cancelCallback也是一样
// 4、:class={ fade } 此处是对象简写 等同于 :class ={ fade: fade }前一个fade是类名，后一个fade是ref()定义的响应式布尔值
// 5、通过类名添加的动画过渡效果需要在组件渲染完毕后延迟一会才会加载，因此需要使用setTimeout来使过渡效果更加'平滑'
</script>

<style lang="less" scoped>
.xxx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  // 外层遮罩添加动画 .xxx-confirm.fade
  background: rgba(0,0,0,0);
    &.fade {
      transition: all 0.4s;
      background: rgba(0,0,0,.5);
    }
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    // 内层确认框添加动画 .wrapper.fade
    transform: translate(-50%,-60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%,-50%);
      opacity: 1;
    }
    .header,.footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xxx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
