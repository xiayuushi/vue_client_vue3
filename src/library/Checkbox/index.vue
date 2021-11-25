<template>
  <div class="xxx-checkbox" @click="checkedChange">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'

export default {
  name: 'XxxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const checked = useVModel(props, 'modelValue', emit)
    const checkedChange = () => {
      const xxx = !checked.value
      checked.value = xxx
      emit('change', xxx)
    }
    return { checked, checkedChange }
  }
}

// 1、useVModel()可以将单个双向绑定的数据包裹一层，后续使用时直接使用该方法处理后的数据，无需通过emit()通知父组件
// 1、第一参数setup第一形参props
// 1、第二参数是子组件接收的父组件v-model传递过来的数据'modelValue'
// 1、第三参数是setup第二形参对象中解构出来的emit
// 1、例如：const xxx = useVModel(props, '父组件v-model双向绑定数据', emit)
// 1、后续，如果想对双向绑定数据做处理，则直接对xxx做处理即可，无需通过props取值，也无需通过emit()通知父组件

// 2、vue3中v-model的默认属性是modelValue 默认方法是update:modelValue
// 3、vue3中拆分 v-model='msg'为： :modelValue='msg' 与 @update:modelValue='msg=$event'
// 4、vue3中可以在同一标签中使用多个v-model，但vue3中没有.sync修饰符
// 5、vue3中拆分 v-model:xxx='msg'为： :xxx='msg' 与 @update:xxx='msg=$event'
// 6、父子组件中，v-model只能存在于父组件中，因此子组件的v-model必须拆分，否则会造成单向数据流报错

// 7、useVModels()可以将多个双向绑定的数据包裹一层，后续使用时直接使用该方法处理后的数据，无需通过emit()通知父组件
// 7、第一参数setup第一形参props
// 7、第二参数是setup第二形参对象中解构出来的emit
// 7、例如：const {xxx, yyy} = useVModel(props,  emit)
// 7、后续，如果想对双向绑定数据做处理，则直接对xxx或者yyy做处理即可，无需通过props取值，也无需通过emit()通知父组件

// 8、让组件支持change事件，必须emit()通知父组件change事件，值已经发生修改（因为change事件不是双向绑定数据，因此必须手动emit()通知）
// 9、组件标签中可以使用$slots.default获取默认插槽的内容 组件方法中可以使用this.$slots.default()获取默认插槽的内容（如果是具名插槽，则$slot点出插槽name属性值即可）
// 10、复选框的change事件，后续在购物车页面修改购物车商品状态时会使用到，因此在封装时必须让封装的组件与原生checkbox一样支持change事件

// 11、必须通过中间变量xxx接收一次再赋值，否则后续切换单选框时没反应（emit传递给父组件的也必须是中间变量xxx）

</script>

<style lang="less" scoped>
.xxx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
