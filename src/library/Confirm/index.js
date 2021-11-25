import Confirm from './index.vue'
import { h, render } from 'vue'

const div = document.createElement('div')
div.setAttribute('class', 'xxx-confirm-container')
document.body.appendChild(div)

export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const vnode = h(Confirm, { title, text, cancelCallback, submitCallback })
    render(vnode, div)
  })
}

// 1. Confirm.vue中通过props传递submitCallback与cancelCallback给当前js模块使用
// 1. 用于将组件确认与取消按钮与Promise对象的.then与.cancel建立联系，实现类似element-ui中confirm提示框效果，即进入到.then则说明点击了确认
// 2. 点击确认按钮，销毁组件关闭对话框，触发resolve
// 3. 点击取消按钮，销毁组件关闭对话框，触发reject
// 4. 函数式调用只对外暴露title与text属性用于使用者修改对话框标题与文本
// 5. Confirm.vue中需要通过props的方式定义当前定义好的submitCallback与cancelCallback函数才会触发Promise对象相应的resolve与reject

// st1、导入组件（导入前的组件已经实现组件式调用）
// st2、创建dom并插入到body中
// st3、通过h函数（或者是createVNode函数，这两个函数都是同一个，h是createVNode的别名简写）创建虚拟dom
// st4、通过render函数将虚拟dom渲染到实体dom，此时可以通过导入当前封装模块实现函数式调用
// st5、挂载到全局app应用实例，让选项api或者组合api都能通过实例方法调用

// N1、如果Confirm.vue还依赖了其他自定义全局通用组件，可能会提示"Failed to resolve component: Xxx"则需要额外导入并注册Xxx组件
// N1、因为Xxx组件是挂载到vue实例上的（即生成组件的dom是vue根容器#app容器下的元素）
// N1、而当前封装的组件如果是采用函数式调用，则生成的dom并非是vue的渲染容器#app的子元素（这点可以打开浏览器控制台查看）
// N1、因此需要在当前组件额外导入并注册Xxx（它只是vue应用实例上的通用全局组件，但当前Confirm组件如果是函数式调用则无法享受Vue全局共享的'便利'）
// N2、组合API(setup周期函数)中必须调用props.submitCallback()才能调用当前Confirm模块中Promise对象定义的submitCallback()销毁组件，cancelCallback也是一样
// N3、如果需要使用选项API的方式调用当前模块封装的Confirm提示框，则还必须挂载到app应用实例上
// N3、例如 在注册为全局模块的js文件中 export default { install(all){ app.config.globalProperties.$confirm = Confirm } }
// N3、注意 挂载的是Confirm的js模块而不是组件
