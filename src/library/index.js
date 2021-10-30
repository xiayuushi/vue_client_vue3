import Skeleton from './Skeleton'
import Carousel from './Carousel'
import More from './More'
import defaultImg from '@/assets/images/200.png'

export default {
  install (app) {
    app.component(Skeleton.name, Skeleton)
    app.component(Carousel.name, Carousel)
    app.component(More.name, More)
    defineDirective(app)
  }
}

const defineDirective = app => {
  app.directive('lazy', {
    mounted (el, obj) {
      const intersectionObserver = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            intersectionObserver.unobserve(el)
            el.onerror = () => {
              el.src = defaultImg
            }
            el.src = obj.value
          }
        },
        {
          threshold: 0
        }
      )

      intersectionObserver.observe(el)
    },
    updated (el) {
      el.onerror = () => {
        el.src = defaultImg
      }
    }
  })
}

// 1、此处就是使用export default导出对象的方式封装全局自定义组件，对象内部必须有一个install()，这点与vue2一样
// 2、app只是一个形参，因为vue3是挂载到createApp()生成的app实例上，指令或者全局组件都是如此，因此vue3用app作形参便于形象理解
// 3、使用xxx.name的方式注册组件，后续挂载到app实例后，还必须在组件内部定义name属性，以name属性值去使用组件

// 4、IntersectionObserver是原生webapi，用于检测可视区
// 4、IntersectionObserver(callback,options)
// 4、第一参数callback是一个回调（两个形参：形参1是一个对象组成的数组，形参2是观察实例），形参1常用固定参数 [{ isIntersecting }]来捕获被检测元素是否进入可视区
// 4、第二参数options是可选配置对象，常用配置 { threshold: 0 // 数值表示被检测元素与可视区的交界区域，0表示一进入可视区就加载 }
// 4、IntersectionObserver()会返回一个实例，
// 4、该实例调用observe()会监测元素是否进入可视区，该实例调用unobserve()会停止监测，该实例调用disconnect()会关闭整个观察实例

// 5、vue3自定义指令周期与vue2自定义指令周期不同，但指令周期函数的4个参数都是相同的
// 6、onerror是原生事件，当图片出错时就会触发
// 7、mounted周期只会触发一次，而onerror监听到图片无法加载就会触发，因此必须在指令的updated周期中再处理一下，防止坑点
// 7、自定义指令周期函数都有四个参数，第一参数el是使用自定义指令的dom元素，第二参数obj是一个对象，可以获取指令的值等信息
// 8、函数defineDirective用于自定义指令v-lazy，实现图片懒加载且当图片出错时显示默认图片
// 9、定义自定义指令时不需要带"v-"前缀，使用时带上前缀

// 10、图片懒加载的实现原理：先不给图片src设置地址，当监听图片盒子进入可视区时，再将图片地址设置给src
// 10、定义好指令后，将地址绑定到src属性的代码改成 v-lazy  例如：:src="xxx" 改成 v-lazy="xxx"

// D1、vue2中大部分的挂载或注册都是在vue上进行的
// D1、vue3中所有的挂载注册都是在createApp()创建的app上进行扩展的，app提供 component directive 函数

// D1、vue2中挂载原型 是在vue.prototype上进行挂载
// D2、vue3如果要挂载原型 是在 app.config.globalProperties上进行挂载

// D3、vue2有全局或者局部过滤器
// D3、vue3没有全局过滤器，在组件的optionsAPI中依旧支持局部过滤器

// D4、vue2的inserted周期 在绑定元素的父组件被挂载后调用
// D4、vue3的mounted周期 在绑定元素的父组件被挂载后调用（对应vue2的inserted周期，是最常用的指令周期函数）

// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法
// 总之：vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// 总之：vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
