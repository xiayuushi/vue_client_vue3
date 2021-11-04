import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export const dataLazyLoad = request => {
  const target = ref(null)
  const data = ref(null)
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        request().then(res => (data.value = res.result))
      }
    },
    {
      threshold: 0
    }
  )
  return { target, data }
}

// 1、dataLazyLoad用于数据懒加载（可视区加载）
// 1、当监听到目标元素进入可视区时，会停止可视区监听，并调用接口去请求数据
// 1、isIntersecting是否进入可视区 stop停止可视区监听
// 1、参数：request是调用接口的api（会返回promise对象，因此后续能够直接.then）
// 1、注意：当前项目的接口返回的且我们需要的都是res.result，因此上面封装时 是将res.result赋值给响应式数据data

// 2、接收返回数据的时候 const data = ref([]) 定义为空数组，后续使用该api请求接口，后续可以使用length进行非空判断
// 3、接收返回数据的时候 const data = ref(null) 定义为null，后续使用该api请求接口，无法使用length进行非空判断
// 4、target是监听的dom，可以由外部传入，之所以从当前函数形参中提取到函数体内部，是为了在外部调用该函数时简化导入ref以及传参的步骤
// 5、threshold是useIntersectionObserver提供的临界点参数，表示当可视区与做可视区加载的盒子临界相交多少时触发（值为0表示一进入可视区就加载）
// 6、该封装方法只能用于vue3组合API内，因为useIntersectionObserver是vue3中vueuse库的方法
// 7、如果想要在组合API外（setup周期外部）使用，可以使用原生的IntersectionObserver进行封装，useIntersectionObserver是基于原生IntersectionObserver进行的封装
