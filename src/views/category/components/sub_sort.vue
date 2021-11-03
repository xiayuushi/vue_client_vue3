<template>
  <div class="sub-sort">
    <div class="sort">
      <a :class="{active: sortParams.sortField===null}" @click="sortChange(null)" href="javascript:void(0);">默认排序</a>
      <a :class="{active: sortParams.sortField==='publishTime'}" @click="sortChange('publishTime')" href="javascript:void(0);">最新商品</a>
      <a :class="{active: sortParams.sortField==='orderNum'}" @click="sortChange('orderNum')" href="javascript:void(0);">最高人气</a>
      <a :class="{active: sortParams.sortField==='evaluateNum'}" @click="sortChange('evaluateNum')" href="javascript:void(0);">评论最多</a>
      <a @click="sortChange('price')" href="javascript:void(0);">
        价格排序
        <i class="arrow up" :class="{active: sortParams.sortField==='price' && sortParams.sortMethod==='asc'}" />
        <i class="arrow down" :class="{active: sortParams.sortField==='price' && sortParams.sortMethod==='desc'}" />
      </a>
    </div>
    <div class="check">
      <XxxCheckbox v-model="sortParams.inventory">仅显示有货商品</XxxCheckbox>
      <XxxCheckbox v-model="sortParams.onlyDiscount">仅显示特惠商品</XxxCheckbox>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'SubSort',
  setup (props, { emit }) {
    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      sortField: null,
      sortMethod: null
    })

    const sortChange = condition => {
      if (condition === 'price') {
        sortParams.sortField = 'price'
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        if (sortParams.sortField === condition) return
        sortParams.sortField = condition
        sortParams.sortMethod = null
      }
    }

    return { sortParams, sortChange }
  }
}

// 1、需要根据接口数据字段定义数据，将这些数据用于排序数据的高亮显示（添加预先定义好的.active类样式）
// 2、价格排序因为有上下箭头表示正倒序，因此须满足 （是价格排序 && 正序）切换上箭头 或者 （是价格排序 && 倒序）切换下箭头
// 3、sortChange是切换排序的方法，只有价格排序相对特殊，因为涉及正倒序（其余的只要点击时，将传参赋值给sortParams.sortField字段即可，类样式就会相应切换）
// 4、即使点击了价格排序，还是必须 sortParams.sortField = 'price' 赋值一次，否则上下箭头的i标签中的:class中的判断不会生效
// 5、价格排序中，将sortParams.sortMethod初始值设为null，用于判断是否是初次点击价格排序
// 5、如果是初次点击价格排序，再将其设置为接口要求的默认的'desc'价格倒序排列
// 6、如果点击非价格排序，点击时除了将传参赋值给sortParams.sortField字段外，还应该重置价格排序为初始的null（价格排序上下箭头都不高亮），如此当下次再初次点击价格排序时，才会是默认的倒序排列
// 7、如果已经选中了的某个非价格排序，再次点击该排序应该阻止操作，否则后续调用接口阶段会随着重复点击而重复发请求...

</script>

<style lang="less" scoped>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xxx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
