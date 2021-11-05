<template>
    <div class="sub-filter" v-if="filterData && !isLoading">
     <div class="item" v-if="filterData && filterData.brands">
       <div class="head">品牌：</div>
       <div class="body">
         <a :class="{ active: filterData.brands.selectedBrandId === item.id }"
            @click="changeBrand(item.id)"
            href="javascript:;" v-for="item in filterData.brands" :key="item.id">
            {{ item.name }}
          </a>
       </div>
     </div>
      <template v-if="filterData && filterData.saleProperties">
        <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
          <div class="head">{{ item.name }}：</div>
          <div class="body">
            <a :class="{ active: item.properties.selectedPropId === sub.id }"
               @click="changeProp(item, sub.id)"
               href="javascript:;" v-for="sub in item.properties" :key="sub.id">
               {{ sub.name }}
            </a>
          </div>
        </div>
      </template>
    </div>
    <div class="sub-filter" v-else>
      <XxxSkeleton class="item xxx-skelecton" width="600px" height="40px" bg="#e4e4e4" animated />
      <XxxSkeleton class="item xxx-skelecton" width="600px" height="40px" bg="#e4e4e4" animated />
      <XxxSkeleton class="item xxx-skelecton" width="600px" height="40px" bg="#e4e4e4" animated />
      <XxxSkeleton class="item xxx-skelecton" width="600px" height="40px" bg="#e4e4e4" animated />
      <XxxSkeleton class="item xxx-skelecton" width="600px" height="40px" bg="#e4e4e4" animated />
      <XxxSkeleton class="item xxx-skelecton" width="600px" height="40px" bg="#e4e4e4" animated />
    </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categorySubFilter } from '@/api/category'

export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const filterData = ref(null)
    const route = useRoute()
    const isLoading = ref(false)

    watch(() => route.params.id, c => {
      if (c && `/category/sub/${c}` === route.path) {
        isLoading.value = true
        categorySubFilter(c).then(({ result }) => {
          result.brands.unshift({ id: undefined, name: '全部' })
          result.brands.selectedBrandId = undefined

          result.saleProperties.forEach(v => {
            v.properties.unshift({ id: null, name: '全部' })
            v.properties.selectedPropId = null
          })

          filterData.value = result
          isLoading.value = false
        })
      }
    }, { immediate: true })

    const getFilterParams = () => {
      const filterParams = { brandId: null, attrs: [] }
      filterParams.brandId = filterData.value.brands.selectedBrandId

      filterData.value.saleProperties.forEach(item => {
        const selectedProp = item.properties.find(v => (v.id === item.properties.selectedPropId))
        if (selectedProp && selectedProp.id) filterParams.attrs.push({ groupName: item.name, propertyName: selectedProp.name })
      })

      if (!filterParams.attrs.length) filterParams.attrs = null
      return filterParams
    }

    const changeBrand = brandId => {
      if (filterData.value.brands.selectedBrandId === brandId) return
      filterData.value.brands.selectedBrandId = brandId
      emit('filterChangeEvent', getFilterParams())
    }

    const changeProp = (item, subId) => {
      if (item.properties.selectedPropId === subId) return
      item.properties.selectedPropId = subId
      emit('filterChangeEvent', getFilterParams())
    }

    return { filterData, isLoading, changeBrand, changeProp }
  }
}
// 1、必须监听当前路由是在二级类目时才会去调用二级类目的接口 请求筛选区的数据
// 2、后端接口并无"全部"选项，因此为了方便页面筛选区域的数据渲染，需要自己为品牌以及各个筛选条件创建一个"全部"选项
// 2、filterData.value.brands.unshift() 是为品牌添加"全部"选项
// 2、v.properties.unshift() 是为各个筛选条件添加"全部"选项
// 2、其中"全部"的id可以定义为 undefined 或者 null 只要能与服务器返回的数据选项的id区分开来即可
// 3、result.brands.selectedBrandId 用于记录当前选中的品牌id（默认是选中"全部"，因此值与"全部"的id值保持一致）
// 4、v.properties.selectedPropId 用于记录当前选中的筛选条件的id（默认是选中"全部"，因此值与"全部"的id值保持一致）
// 5、建议先处理接口数据，再将处理过后的数据设置给自定义的响应式数据并return到外界使用
// 6、因为数据只要回来一次，后续就不会没有数据的情况，因此想要实现刷新触发骨架屏的效果，必须再定义一个布尔值isLoading来实现效果
// 7、获取筛选或排序后的商品，接口需要的参数很多，需要自己拼接，格式 { brandId: 'xxx', attrs: [{ groupName: '颜色', propertyName: '蓝色' }] }
// 8、getFilterParams函数用于获取筛选参数，将筛选的参数以对象的形式返回，当点击二级分类的筛选条目后，将这些参数emit()交给父组件sub.vue
// 9、定义空数据时，null 与 字符串的'' 是不同的，建议使用null，例如使用key=null时，该key字段不会通过axios发送到后台，但如果使用key=''，则key会被axios发送到后台
// 10、if (!filterParams.attrs.length) filterParams.attrs = null 表示如果attrs数组为null，则不会将attrs字段通过axios发送给后台

</script>

<style lang="less">
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          // 当点击时会添加.active类 选中项会添加文字颜色
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
    .xxx-skelecton {
      ~ .xxx-skelecton {
        margin-top: 20px;
      }
    }
  }
</style>
