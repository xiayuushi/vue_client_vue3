import Skeleton from './Skeleton'
import Carousel from './Carousel'
import More from './More'

export default {
  install (app) {
    app.component(Skeleton.name, Skeleton)
    app.component(Carousel.name, Carousel)
    app.component(More.name, More)
  }
}

// 1、此处就是使用export default导出对象的方式封装全局自定义组件，对象内部必须有一个install()，这点与vue2一样
// 2、app只是一个形参，因为vue3是挂载到createApp()生成的app实例上，因此用app作形参便于形象理解
// 3、使用xxx.name的方式注册组件，后续挂载到app实例后，还必须在组件内部定义name属性，以name属性值去使用组件

// D1、vue2中大部分的挂载或注册都是在vue上进行的
// D1、vue3中所有的挂载注册都是在createApp()创建的app上进行扩展的，app提供 component directive 函数

// D1、vue2中挂载原型 是在vue.prototype上进行挂载
// D2、vue3如果要挂载原型 是在 app.config.globalProperties上进行挂载

// D3、vue2有全局或者局部过滤器
// D3、vue3没有全局过滤器，在组件的optionsAPI中依旧支持局部过滤器

// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法
// 总之：vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// 总之：vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
