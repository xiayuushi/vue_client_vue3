<template>
  <div class="xxx-bread-item">
    <router-link :to="to" v-if="to"><slot /></router-link>
    <span v-else><slot /></span>
  </div>
</template>

<script>
export default {
  name: 'XxxBreadItem',
  props: {
    to: {
      type: [String, Object]
    }
  }
}

// 1、该组件作为Bread/index.vue面包屑整体容器组件的插槽内容，是面包屑的每一项
// 2、to属性的值是路径，格式可以是字符串或者对象
// 3、当前组件的样式已经在Bread/index.vue中写好，Bread/index.vue的css作用域scoped属性必须去掉，否则当前组件的样式不会生效
</script>

<style></style>
