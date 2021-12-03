<template>
  <div class="xxx-tabs-panel" v-if="name === activeName">
    <slot />
  </div>
</template>
<script>
import { inject } from 'vue'

export default {
  name: 'XxxTabsPanel',
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    const activeName = inject('activeName')

    return { activeName }
  }
}

// 1、label是选项卡项中的标题，name是唯一标识
// 2、该组件作为XxxTabs组件的插槽内容，会在父组件XxxTabs中通过this.$slots.default()的方式获取默认插槽内容并使用
</script>
