import AppNav from '../components/AppNav'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import AppHeaderNav from '../components/AppHeaderNav'
import AppHeaderSticky from '../components/AppHeaderSticky'

export default function (Vue, options) {
  Vue.component(AppNav.name, AppNav)
  Vue.component(AppHeader.name, AppHeader)
  Vue.component(AppFooter.name, AppFooter)
  Vue.component(AppHeaderNav.name, AppHeaderNav)
  Vue.component(AppHeaderSticky.name, AppHeaderSticky)
}

// 1、vue2与vue3封装全局公共组件是类似的，区别只在于注册挂载不同
// D1、vue2 是在项目入口main.js中使用 Vue.use()进行注册
// D2、vue3 是在项目入口main.js中不再使用use注册，而是直接挂载到 createApp()的创建的实例app中，与store或router链式挂载到一起

// 2、此处第一参数只是形参，形参名可随意，在main.js中谁调用就会传入谁去触发构造函数创建相应的实例对象
// D1、vue2 在main.js中 Vue.use()时，则会触发该构造函数创建公共组件
// D2、vue3 在main.js中 createApp()生成app实例时，则会传入app去触发该构造函数创建公共组件

// 3、此处以 xxx.name的形式定义名称，则必须到组件内部定义name属性，后续以name属性值为公共组件的使用名称

// 4、全局公共组件的封装有两种写法，这是写法之一，另一种写法是export default直接导出对象，对象内有一个install()
// 5、当前项目会在src/library目录展示写法2 去封装自定义插件
