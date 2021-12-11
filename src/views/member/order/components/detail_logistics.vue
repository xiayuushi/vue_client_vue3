<template>
  <div class="detail-logistics">
    <p>
      <span>{{ list[0].text }}</span>
      <span>{{ list[0].time }}</span>
    </p>
    <a href="javascript:;" @click="logisticsOrderHandler(order)">查看物流</a>
    <!-- 查看物流组件 -->
    <teleport to='#xxx'>
      <OrderLogistics ref="logisticsComponent" />
    </teleport>
  </div>
</template>

<script>
import { ref } from 'vue'
import { logisticsOrder } from '@/api/order'
import { useLogisticsOrderHandler } from '../index'
import OrderLogistics from '../components/order_logistics'

export default {
  name: 'DetailLogistics',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  components: { OrderLogistics },
  async setup (props) {
    const res = await logisticsOrder(props.order.id)
    const list = ref(res.result.list)
    return { list, ...useLogisticsOrderHandler() }
  }
}

// 1、setup第一形参props的数据就是响应式数据，不能将其进行ES6解构否则会失去响应式效果，
// 1、setup第二形参是个非响应式对象，因此可以将其ES6解构
// 2、将API接口返回的数据定义为响应式数据用于渲染
// 3、此处复用了order_logistics.vue的逻辑打开物流信息对话框
// 4、teleport是vue3内置的传输门组件，用于将弹层类组件传输到安全的位置，避免出现具有位移、定位、或者层级的父容器因为此类因素发生影响
// 4、teleport的使用
// 4、st1 在项目静态页#app同级的地方添加一个 #xxx 作为弹层类组件使用时的安全容器
// 4、st2 在使用弹层类组件时，外部包裹teleport组件
// 4、st3 在teleport中设置to属性，指向#xxx
</script>

<style lang="less" scoped>
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
