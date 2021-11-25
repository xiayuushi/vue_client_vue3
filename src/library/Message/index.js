import Message from './index.vue'
import { createVNode, render } from 'vue'

const div = document.createElement('div')
div.setAttribute('class', 'xxx-message-container')
document.body.appendChild(div)

let timer = null
export default ({ type = 'warn', text = '警告', time = 3000 }) => {
  const vnode = createVNode(Message, { type, text, time })
  render(vnode, div)
  clearTimeout(timer)
  timer = setTimeout(() => (render(null, div)), time)
}

// 1、createVNode()就是h()
// 1、参数1：一个 HTML 标签名、一个组件、一个异步组件、或一个函数式组件 (对象、组件、字符串标签)
// 1、参数2：对象（内部是属性名与属性值的键值对）
// 1、参数3：子节点（可以是对象、数组、字符串）
// 1、该方法会根据组件创建虚拟节点

// 2、render()
// 2、参数1：h()函数创建的虚拟dom
// 2、参数2：用于装载虚拟dom的真实dom
// 2、该方法用于将虚拟dom渲染到真实dom容器中

// 3、以函数调用的方式来调用自定义封装的消息提示组件
// 3、1 实现类似于element-ui中的导入 import { Message } from 'element-ui'后调用 Message({ text: '提示文本' })）
// 3、st1 导入自定义封装的消息提示组件Message
// 3、st2 定义并导出方法，导入h函数用于创建虚拟dom（vue组件是通过虚拟dom创建后挂载到真实的dom上的）
// 3、st3 准备一个真实的dom用于接收虚拟dom
// 3、st4 导入render函数用于将虚拟dom渲染成真实的dom
// 3、st5 设置定时器让消息提示框几秒后自动消失（render函数中置空虚拟dom即可）
// 3、st6 此时在组件中导入当前文件为Message就可以直接通过 Message({type:'', text:''})的方式调用了（在vue3组合API中推荐这种方式调用）

// 3、2 实现类似element-ui中无需导入 直接通过组件实例 this.$message()的方式调用 (需要将当前js文件封装为全局插件)
// 3、st7 在src/library/index.js中导入当前.js文件 例如：import Message from '@/library/Message/index.js'
// 3、st8 在src/library/index.js中创建install方法并导出 例如：export default install(app){ ... }
// 3、st9 在install方法函数体内 将message挂载到全局 app.config.globalProperties.$message = message
// 3、st10 将src/library/index.js导入到项目入口文件中 例如：import plugin from './library/index'
// 3、st11 在入口文件src/main.js中 createApp(App).use(plugin).mount('#app')
// 3、此时在选项API中可以通过this.message()调用
// 3、此时在组合API中可以先从getCurrentInstance()中解构proxy，再通过proxy.message()调用（在vue3组合API中不推荐这种调用方式）

// 4、当前封装的Message消息提示框有4种调用方法
// 4、1 直接以组件方式调用 <XxxMessage type="" text="" />
// 4、2 在选项API中 以 this.$message({type: '', text:''})的方式调用
// 4、3 在组合API中 以 proxy.$message({type: '', text:''})的方式调用，必须先从vue中导入getCurrentInstance方法，再从该方法中解构出proxy后进行消息提示框的调用
// 4、4 导入当前js文件为Message，并以Message({type:'', text:''})的方式调用， 必须先 import Message from '@/library/Message/index.js';

// N1、上面setAttribute()设置div类名是为了标识区分消息提示的div与其他div，并无实际用途
// N2、vue2通过vue.prototype.$xxx=xxx 的方式挂载到组件实例
// N3、vue3通过app.config.globalProperties的方式挂载到组件实例，其中app是createApp()创建的应用对象
// N4、在组合API中不能直接获取组件实例，必须通过getCurrentInstance()解构proxy，这个proxy就是当前组件的实例（相当于vue2中组件的this）
