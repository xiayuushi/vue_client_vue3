<template>
  <div class="xxx-pagination">
    <a @click="changePage(currentPage - 1)" v-if="currentPage > 1" href="javascript:void(0);">上一页</a>
    <a v-else class="disabled" href="javascript:void(0);">上一页</a>
    <span v-if="pagination.startPage > 1">...</span>
    <a @click="changePage(item)" :class="{ active: item === currentPage }"
      v-for="item in pagination.paginationButtonList" :key="item" href="javascript:void(0);">
      {{ item }}
    </a>
    <span v-if="pagination.endPage < pagination.totalPage">...</span>
    <a @click="changePage(currentPage + 1)" v-if="currentPage < pagination.totalPage" href="javascript:void(0);">下一页</a>
    <a v-else class="disabled" href="javascript:void(0);">下一页</a>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'XxxPagination',
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    totalCount: {
      type: Number,
      default: 100
    },
    defaultPage: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    const pageSize = ref(10)
    const totalCount = ref(100)
    const currentPage = ref(5)
    const paginationNumButtons = 5

    const pagination = computed(() => {
      const totalPage = Math.ceil(totalCount.value / pageSize.value)

      const offsetStep = Math.floor(paginationNumButtons / 2)
      let startPage = currentPage.value - offsetStep
      let endPage = startPage + paginationNumButtons - 1

      if (startPage < 1) {
        startPage = 1
        endPage = (startPage + paginationNumButtons - 1) > totalPage ? totalPage : (startPage + paginationNumButtons - 1)
      }

      if (endPage > totalPage) {
        endPage = totalPage
        startPage = (endPage - paginationNumButtons + 1) < 1 ? 1 : (endPage - paginationNumButtons + 1)
      }

      const paginationButtonList = []
      for (let i = startPage; i < endPage + 1; i++) {
        paginationButtonList.push(i)
      }

      return { totalPage, startPage, endPage, paginationButtonList }
    })

    const changePage = newPage => {
      currentPage.value = newPage
      emit('onChange', newPage)
    }

    watch(props, () => {
      pageSize.value = props.pageSize
      totalCount.value = props.totalCount
      currentPage.value = props.defaultPage
    }, { immediate: true })

    return { currentPage, pagination, changePage }
  }
}

// 1、已知且可预设确定的数据：总条数totalCount、当前页currentPage、页容量pageSize、分页器按钮个数paginationNumButtons
// 2、通过计算属性求得分页器交互所需的其他数据：分页器起始页按钮元素startPage、分页器结束页按钮元素endPage、总页数totalPage、分页器按钮列表paginationButtonList
// 3、offsetStep控制按钮往其中一边偏移，而不能是往两边同时偏移，之所以除以2是为了取中心按钮，只有在中心按钮才能进行某一边的偏移（偏移量是分页器数字按钮总个数的一半向下取整）
// 3、Q1：奇数个按钮，则偏移1/2时，正好偏移好了；例如 5个按钮，则在中心按钮往前或者后偏移2个（2.5向下取整），此时正好
// 3、Q2：但如果是偶数个按钮，则可让中心按钮往其中一边偏移1/2，然后用分页器总按钮个数paginationNumButtons减一：
// 3、Q2：例如6个按钮，则不能直接往前或者后偏移3个（因为中心按钮往前或后偏移3个，则分页器总按钮个数是7个，已经超出6个，因此此时需要减一）
// 4、点击分页器数组中的按钮时，对于偏移时按钮的起始页与结束页，需要分三种情况
// 4、Q1：在合理范围内偏移的理想情况：起始页数字按钮=中心按钮数字-偏移； 结束页数字按钮=起始页数字按钮+分页器数字按钮总个数-1 （相当于是求结束页数字按钮所在的索引）
// 4、Q2：往前偏移时起始页小于1的情况：此时需要重置起始页为第1页（因为页码从1开始），另外起始页往前偏移了会导致结束页按钮数值的改变（结束页页码不能超过总页数）
// 4、Q3：往后偏移时结束页超过总页数的情况：此时需要重置结束页为总页数，另外起始页往后偏移了会导致起始页按钮数值的改变（起始页页码不能小于1）
// 5、for循环遍历时，endPage是索引，遍历中止条件是length，因此需要 endPage+1
// 6、分页器数字按钮数组[5,6,7,8,9]，往前偏移时求结束页对应的元素，则 结束页对应的元素9 = 起始页startPage对应的元素5 + 分页器数字按钮长度5 - 1
// 6、分页器数字按钮数组[5,6,7,8,9]，往后偏移时求起始页对应的元素，则 起始页对应的元素5 = 结束页endPage对应的元素9 - 分页器数字按钮长度5 + 1
// 7、是否显示"上一页"：当前页currentPage是否大于1，是则显示
// 7、是否显示"下一页"：当前页currentPage是否小于总页数totalPage，是则显示
// 7、是否显示上一页旁边的"..."：起始页startPage是否大于1，是则显示
// 7、是否显示下一页旁边的"..."：结束页endPage是否小于总页数totalPage，是则显示
// 8、封装的分页器需要使用props对外暴露使用参数，外部使用时传入该参数
// 8、当外部使用分页器组件时，须传入数据（在分页器组件内props接收并监听props数据值的改变进行赋值）
// 8、当分页器页码发生改变时，应该emit通知父组件更新新页码（此时要将父组件中调用接口时的页码参数params.page进行修改，数据驱动视图更新）
// 9、props暴露的总条数totalCount需要与接口返回的数据相互关联，才能实现分页数据更新驱动视图更新
// 9、props暴露的默认选中页defaultPage、页容量pageSize 需要与当前组件的currentPage与pageSize相互关联
</script>

<style lang="less" scoped>
.xxx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
