<template>
  <div class="home-panel">
    <div class="container">
      <div class="head">
        <h3>{{ title }}<small>{{ subTitle }}</small></h3>
        <!-- 具名插槽（自定义右上角内容结构） -->
        <slot name="right" />
      </div>
        <!-- 默认插槽（自定义下方主内容区结构） -->
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePanel',
  props: {
    title: {
      type: String,
      default: null
    },
    subTitle: {
      type: String,
      default: null
    }
  }
}
// 1、vue中使用插槽定义自定义结构，使用作用域插槽传输数据
// 2、具名插槽定义使用slot标签 name="xxx"，使用时使用template标签 #xxx或者v-slot:xxx 去对应传入替换结构
// 3、默认插槽定义： <slot name="default" />  另外也可以不写name属性，直接一个slot标签就是默认插槽
// 4、默认插槽使用： <template v-slot:default>自定义结构</template> 另外也可以不写v-slot:default 或 #default ，默认就对应替换默认插槽
// 5、总之，slot标签定义插槽，将来使用插槽时会替换slot标签所在的部分，达到结构替换复用的目的
</script>

<style lang="less" scoped>
.home-panel {
  background-color: #fff;
  .head {
    padding: 40px 0;
    display: flex;
    align-items: flex-end;
    h3 {
      flex: 1;
      font-size: 32px;
      font-weight: normal;
      margin-left: 6px;
      height: 35px;
      line-height: 35px;
      small {
        font-size: 16px;
        color: #999;
        margin-left: 20px;
      }
    }
  }
}
</style>
