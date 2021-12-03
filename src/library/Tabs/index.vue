<script>
import { provide } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XxxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    const modelVal = useVModel(props, 'modelValue', emit)
    provide('activeName', modelVal)

    const tabClick = (name, index) => {
      modelVal.value = name
      emit('tab-click', { name, index })
    }

    return { modelVal, tabClick }
  },
  render () {
    const tabsPanel = this.$slots.default()
    const allTabsPanelList = []
    tabsPanel.forEach(item => {
      if (item.type.name === 'XxxTabsPanel') {
        allTabsPanelList.push(item)
      } else {
        item.children.forEach(v => allTabsPanelList.push(v))
      }
    })
    const nav = (
      <nav>
        {allTabsPanelList.map((v, i) => {
          return (
            <a
              href='javascript:;'
              class={{ active: v.props.name === this.modelVal }}
              onClick={() => this.tabClick(v.props.name, i)}
            >
              {v.props.label}
            </a>
          )
        })}
      </nav>
    )
    return <div class='xxx-tabs-container'>{[nav, allTabsPanelList]}</div>
  }
}

// 1、vue中的JSX语法，借助babel，可以通过render选项返回HTML结构，属性绑定、方法绑定、插值等操作都是单个大括号
// 2、在JSX中不能使用vue的任何指令，在render选项内就是JSX语法，因此使用单大括号作为插值语法
// 3、this.$slots.default()可以获取传入到当前组件的默认插槽内容，它是一个数组，传入了几项，数组就有几个元素
// 4、props.label是因为在作为插槽的组件中通过props属性定义了label
// 4、因此就可以在当前组件先通过this.$slots.default()获取整个插槽内容，再遍历插槽获取每一项内容，最后通过props.xxx的形式获取具体传入的属性
// 5、使用v-for动态渲染的组件通过this.$slots.default()只能获取静态的内容，无法直接获取动态插入的内容
// 6、遍历默认插槽内容this.$slots.default() 其item.type.name === 'XxxTabsPanel'则说明是静态内容，否则为动态遍历渲染出来的
// 7、tabsPanel是tabs_panel.vue中传入的默认插槽的内容，它整体是tabs栏每一项（含头部nav与内容allTabsPanelList两个部分）
// 7、allTabsPanelList是整合了动态生成与静态生成的内容的数组，nav是tabs栏头部，tabsPanel是tabs栏头部对应的下方内容
// 8、除了setup，其余的都是选项API，都可以通过this获取当前组件实例
</script>

<style lang="less" scoped>
.xxx-tabs-container {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
