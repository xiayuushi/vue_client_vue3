import { ref, onUnmounted } from 'vue'
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'

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

export const payInterval = () => {
  const time = ref(0)
  const timeText = ref('')

  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, { immediate: true })

  onUnmounted(() => pause())

  const start = (payloadTimeStamp) => {
    time.value = payloadTimeStamp
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return { start, timeText }
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

// 8、payInterval用于处理支付倒计时
// 8、对外暴露的可使用的数据：
// 8、timeText是转成'xx分xx秒'后的文本格式时间
// 8、start是调用开启倒计时的方法，将从服务器获取的时间戳数值payloadTomeStamp传入后就会开启倒计时
// 8、即导入当前封装的payInterval并调用其start方法就会开启倒计时
// 8、导入：import { payInterval } from '@/hooks'
// 8、解构：const { start, timeText } = payInterval
// 8、使用：只需要在合适的位置调用 start(时间戳数值)，将timeText直接用于页面渲染
// 8、timeText.value = dayjs.unix(time.value).format('mm分ss秒')之所以写两次，是避免一开始从58秒开始倒计时（正常是从59秒开始倒计时）
