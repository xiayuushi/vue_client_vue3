<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{ label }}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'

export default {
  name: 'XxxNumbox',
  props: {
    modelValue: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    const modelVal = useVModel(props, 'modelValue', emit)
    const changeNum = step => {
      const count = modelVal.value + step
      if (count > props.max || count < props.min) return
      modelVal.value = count
      emit('change', count)
    }
    return { changeNum }
  }
}
// 1、使用useVModel()处理过后的数据直接就是双向绑定的响应式数据，无需手动emit()通知父组件，因此此处实现响应式并没有使用emit()
// 2、通常会提供一个自定义的方法给外界去获取输入框变更后的数值，例如上面的change事件
// 3、label数量选择组件的显示文本、modelValue双向绑定的数据、min数量可选择的最小值、max数量可选择的最大值（通常是商品的SKU库存量）
// 4、该数量选择组件不能直接输入数量，只能通过加减按钮增删数量
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
