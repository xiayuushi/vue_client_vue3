<script>
export default {
  name: 'XxxSteps',
  props: {
    active: {
      type: Number,
      default: 1
    }
  },
  render () {
    const stepsItem = this.$slots.default()
    const dynamicItems = []
    stepsItem.forEach(item => {
      if (item.type.name === 'XxxStepsItem') {
        dynamicItems.push(item)
      } else {
        item.children.forEach(v => (dynamicItems.push(v)))
      }
    })
    const stepsItemJsx = dynamicItems.map((item, index) => {
      return (
        <div class="xxx-steps-item" class={{ active: index < this.active }}>
          <div class="step"><span>{index + 1}</span></div>
          <div class="title">{item.props.title}</div>
          <div class="desc">{item.props.desc}</div>
        </div>
      )
    })
    return <div class="xxx-steps">{stepsItemJsx}</div>
  }
}

// 1、item.type.name === 'XxxStepsItem'存在，则说明是直接写的XxxStepsItem组件；否则就是v-for遍历生成的组件
// 2、基于原先写好的静态组件进行改造（构造完成后原先写好的静态组件就没有template结构了），构造成如今使用render选项生成的JSX结构的组件
// 3、dynamicItems.map()遍历时的第一个形参item就是一个XxxStepsItem组件（即，src/library/Step/item.vue）
// 4、步骤流程
// 4、 1 获取到默认插槽的节点
// 4、 2 获取所有的动态生成的XtxStepsItem组件节点（需要考虑两种情况：直接写的组件以及v-for遍历生成的组件）
// 4、 3 根据动态节点生成 XxxStepsItem组件 的jsx对象（可以参考之前写好的静态结构来生成JSX）
// 4、 4 插入到大容器中

</script>

<style lang="less" scoped>
  .xxx-steps {
    display: flex;
    text-align: center;
    .xxx-steps-item {
      flex: 1;
      .step {
        position: relative;
        > span {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 48px;
          font-size: 28px;
          color: #ccc;
          background: #fff;
          border: 2px solid #e4e4e4;
          line-height: 44px;
          border-radius: 50%;
          z-index: 1;
        }
      }
      .step::before, .step::after {
        content: '';
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background-color: #e4e4e4;
      }
      .step::before {
        left: 0;
      }
      .step::after {
        right: 0;
      }
      .title {
        color: #999;
        padding-top: 12px;
      }
      .desc {
        font-size: 12px;
        color: #999;
        padding-top: 6px;
      }
    }
    // 第一个没有左边的进度条
    .xxx-steps-item:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    // 最后一个没有右边的进度条
    .xxx-steps-item:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    // 当前正在进行的进度状态读条
    .xxx-steps-item.active {
      .step {
        > span {
          color: #fff;
          border-color: @xtxColor;
          background: @xtxColor;
        }
        // 使用伪元素制作左右两侧的横向直线进度读条
        &::before, &::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
  }
</style>
