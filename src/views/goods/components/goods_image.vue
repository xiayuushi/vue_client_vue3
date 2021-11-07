<template>
  <div class="goods-image">
    <!-- 右侧的放大图（背景图backgroundSize是原图宽高的2倍） -->
    <div class="large" v-show="show" :style="[{backgroundImage:`url(${ images[currIndex] })`}, largePosition]"></div>
      <!-- 左侧的预览图容器 -->
    <div class="middle" ref="target">
      <!-- 图片 -->
      <img :src="images[currIndex]" alt="">
      <!-- 移动遮罩层 -->
      <div class="layer" v-show="show" :style="layerPosition"></div>
    </div>
    <ul class="small">
      <li v-for="(item, index) in images" :key="index" :class="{active:currIndex === index}">
        <img @mouseenter="currIndex = index" :src="item" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'

export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const currIndex = ref(0)

    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)

    const show = ref(false)
    const layerPosition = reactive({ left: 0, top: 0 })
    const largePosition = reactive({ backgroundPositionX: 0, backgroundPositionY: 0 })

    watch([elementX, elementY, isOutside], () => {
      const position = { x: 0, y: 0 } // 遮罩层位置坐标（用于边界检测，该数据会赋值给遮罩层和放大镜背景图的css属性用于驱动视图更新）

      if (elementX.value < 100) position.x = 0 // 此时遮罩层左侧贴边（条件判断是遮罩层坐标的左侧临界点，左侧临界点是遮罩层宽度1/2）
      else if (elementX.value > 300) position.x = 200 // 此时遮罩层右侧贴边（条件判断是遮罩层坐标的右侧临界点，右侧临界点是预览图宽度减去遮罩层宽度1/2）
      else (position.x = elementX.value - 100) // 此时遮罩层不贴边（光标左右移动的有效距离必须减去遮罩层宽度的1/2）

      if (elementY.value < 100) position.y = 0 // 此时遮罩层顶部贴边（条件判断是遮罩层坐标的顶部临界点，光标往上移动遮罩层不能跑出预览图容器）
      else if (elementY.value > 300) position.y = 200 // 此时遮罩层底部贴边（条件判断是遮罩层坐标的底部临界点，光标往下移动遮罩层不能跑出预览图容器）
      else (position.y = elementY.value - 100) // 此时遮罩层顶部贴边（光标上下移动的有效距离必须减去遮罩层高度的1/2）

      show.value = !isOutside.value
      layerPosition.left = position.x + 'px'
      layerPosition.top = position.y + 'px'

      largePosition.backgroundPositionX = -2 * position.x + 'px'
      largePosition.backgroundPositionY = -2 * position.y + 'px'
    }, {
      immediate: true
    })

    return { currIndex, target, show, layerPosition, largePosition }
  }
}

// 1、放大镜的效果使用背景图来做，将背景图与预览图设置成一样的图片，并启用css样式属性"background-size"来控制放大比例
// 2、在预览图内部设置一个遮罩层，需要控制遮罩层不能超出父级盒子预览图容器
// 3、当在预览图内移动遮罩层时，右侧的放大图也会跟随移动（遮罩层的xy轴坐标与放大图的xy轴坐标是同一个坐标）

// 4、使用@vueuse/core库中的useMouseInElement来绑定并获取指定容器（左侧预览图容器）的坐标信息、是否出界等
// 4、useMouseInElement()必须传入指定的容器target，并返回一个参数对象，该参数对象有坐标轴信息相关属性、以及是否移出容器外的isOutside属性
// 4、useMouseInElement()返回的数据属性也都是响应式数据，因此须经过.value的方式取值
// 4、useMouseInElement()返回的数据属性，x与y是基于浏览器的坐标、elementX与elementX是基于指定容器的

// 5、要实现放大镜效果，需要定义如下参数：show、layerPosition、largePosition
// 5、show 是否显示遮罩层与放大镜效果（光标进入预览图，就会显示遮罩层与放大镜效果）；
// 5、layerPosition 是遮罩层的相关样式坐标位置（遮罩层的移动是css样式属性top与left的改变，另外该属性会随光标移动变化的，因此须定义成响应式的数据）；
// 5、largePosition 是放大镜的相关样式坐标位置（放大图的移动是css样式属性backgroundPosition的改变，该属性会随遮罩层移动而变化，因此也须定义成响应式的数据）

// 6、watch监听useMouseInElement()中得到的数据，去更新layerPosition与largePosition的数据，让数据驱动视图，实现放大镜效果
// 6、watch同时监听多个数据，第一参数可以传入数组
// 6、useMouseInElement()中得到的数据elementX、elementY、isOutside都是响应式数据，因此无需以函数返回值的形式传入watch第一参数中

// 7、移动遮罩层时，需要依赖useMouseInElement()得到指定容器的xy轴坐标做边界判断，
// 7、因考虑到更新遮罩层坐标与放大镜坐标都需要依赖这个边界判断，因此可以定义为对象position（对该对象x与y轴判断好之后再赋值给遮罩层与放大镜，数据驱动视图更新）
// 7、以遮罩层宽高的1/2作为中心点（光标移动距离超过中心点时移动的距离才是有效的移动距离）
// 7、预览图内的遮罩层宽高200x200，预览图宽高为400x400，以光标在水平方向移动为例，临界点分3种情况
// 7、光标必须在预览图内移动，且光标移动时控制的遮罩层不能跑出父容器预览图盒子外（水平方向与垂直方向情况是一样的，以下以水平方向进行说明）
// Q1、光标elementX在小于200/2（光标坐标是遮罩层宽度一半）时，此时遮罩层左侧贴着预览图盒子（预览图x轴坐标与遮罩层x轴坐标重叠都为0），光标向左移动，遮罩层无法超出左侧临界  if(elementX.value<100) position.x=0
// Q2、光标elementX在大于400-200/2（光标坐标是预览图盒子减去遮罩层宽度一半）时，此时遮罩层右侧贴着预览图盒子右侧（坐标须用预览图宽度减去整个遮罩层宽度），光标向右移动，遮罩层无法超出右侧临界else if(elementX.value>300) position.x=400-200
// Q3、光标elementX在以上两种情况之外时（光标在有效移动范围区域内），即遮罩层在预览图盒子之内不贴边时，移动的距离就是减去遮罩层宽度的1/2的距离， else (position.x = elementX.value-200/2)

// 8、遮罩层移动时放大镜跟随移动，数据驱动视图更新的三个重要数据：光标位置elementXY、遮罩层临界点位置（遮罩层宽高的一半与预览图容器宽度进行计算）、遮罩层位置position
// 8、光标位置elementX是useMouseInElement()得出的光标在预览图中移动时，x轴的坐标
// 8、遮罩层临界点位置有3种情况：遮罩层在预览图容器内左侧贴边时为0的情况，遮罩层在预览图容器内右侧贴边时为400-200/2的情况，遮罩层在预览图容器内不贴边时的情况
// 8、遮罩层位置position（这个position的xy轴会赋值给遮罩层的css样式left与top，也会与做放大镜的背景图的css样式backgroundPosition进行计算）

</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    // 使用背景图backgroundSize来做"放大镜"效果（放大容器或原图的2倍）
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    position: relative;
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    cursor: move;
    // 遮罩层
    .layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
