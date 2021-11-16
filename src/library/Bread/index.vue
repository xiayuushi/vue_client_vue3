<script>
import { h } from 'vue'

export default {
  name: 'XxxBread',
  render () {
    const breadItems = this.$slots.default()
    const dynamicItems = []

    breadItems.forEach((v, i) => {
      dynamicItems.push(v)
      if (i < (breadItems.length - 1)) {
        dynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })

    return h('div', { class: 'xxx-bread' }, dynamicItems)
  }
}

// 1、this.$slots.default() 可以获取传入到当前组件的默认插槽的内容（获取的是整体面包屑的每一项，即文字与间隔符号）
// 2、this.$slots.具名插槽名称()   可以获取到传入当前组件的具名插槽的内容
// 3、vue生成组件模板内容的三种方式：el选项（需预先准备好dom）、template选项（本质是模板字符串生成dom结构）、render选项（函数动态生成模板结构）
// 4、render是一个函数，返回组件的模板结构（html结构）
// 4、render的形参是一个回调createElement函数，该函数简写为h
// 4、render: h => h('标签名',{标签属性键值对}, 子节点 )
// 5、vue2中可以直接使用h创建标签，在vue3中必须从vue中导入h才能使用h创建标签

// 动态创建面包屑每一项，且不生成最后一项的面包屑间隔符号
// st1、使用h函数创建一个动态数组用于存放面包屑的每一项
// st2、遍历传入到当前组件的插槽内容，将面包屑每一项添加到数组中，
// st3、面包屑最后一项不会添加 i 标签（即，面包屑最后一项不会有间隔符号 ，因此非最后一项就添加间隔符号）
// st4、将已经准备好动态数组传入到父级结构（即，面包屑容器盒子）中

//  后续使用 <XxxBread> <XxxBreadItem to="/xxx">首页1</XxxBreadItem> </XxxBread>
</script>

<style lang="less">
.xxx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}

// 1、后续Bread/item.vue的结构会替换此处slot，
// 1、因此Bread/item.vue与Bread/index.vue是插槽关系，而不是父子关系
// 2、父子组件中才能使用::v-deep深度选择器作用到子组件及子组件生成的内容
// 2、使用深度选择器::v-deep无法作用到BreadItem，因此必须去掉Bread/index.vue中css的scoped作用域才能将类样式作用到Bread/item.vue中
// 4、深度选择器作用于父子组件间，在父组件中使用深度选择器，能够作用到子组件及子组件生成的样式以便进行样式覆盖
// 5、vue3中 ::v-deep 已被废弃，虽然能够使用但是会有警告，建议使用 :deep(css选择器) 来替代 ::v-deep
</style>
