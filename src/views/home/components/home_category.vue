<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <!-- 左侧分类列表 -->
    <ul class="menu">
      <li :class="{ active: categoryId && categoryId === item.id }" v-for="item in menuList" :key="item.id" @mouseenter="categoryId = item.id">
        <RouterLink :to="`/category/${ item.id }`">{{ item.name }}</RouterLink>
        <template v-if="item.children">
          <RouterLink :to="`/category/sub/${ sub.id }`" v-for="sub in item.children" :key="sub.id" >{{ sub.name }}</RouterLink>
        </template>
        <template v-else>
          <XxxSkeleton width="60px" height="18px" bg="rgba(255, 255, 255, .1)" animated style="margin-right: 20px;" />
          <XxxSkeleton width="50px" height="18px" bg="rgba(255, 255, 255, .1)" animated />
        </template>
      </li>
    </ul>
    <!-- 左侧分类列表对应的右侧商品（弹出层） -->
    <div class="layer">
      <h4 v-if="curCategory">{{ categoryId !== 'brand' ? '分类推荐' : '品牌推荐' }}<small>根据您的购买或浏览记录推荐</small></h4>
      <ul v-if="curCategory && curCategory.goods">
        <li v-for="item in curCategory.goods" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <ul v-if="curCategory && curCategory.brandlist && curCategory.brandlist.length">
        <li class="brand" v-for="item in curCategory.brandlist" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" alt="" />
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{ item.place }}</p>
              <p class="desc ellipsis">{{ item.name }}</p>
              <p class="name ellipsis-2">{{ item.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { homeBrand } from '@/api/home'
import { ref, reactive, computed } from 'vue'

export default {
  name: 'HomeCategory',
  setup () {
    const store = useStore()

    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-children', name: '品牌推荐' }],
      brandlist: [] // 自定义字段用于存放服务器返回的热门品牌（是个数组列表，元素是一个个的对象）
    })

    const menuList = computed(() => {
      const list = store.state.category.list.map(v => ({
        id: v.id,
        name: v.name,
        goods: v.goods,
        children: v.children && v.children.slice(0, 2)
      }))
      list.push(brand)
      return list
    })

    const categoryId = ref(null)
    const curCategory = computed(() => menuList.value.find(v => v.id === categoryId.value))

    homeBrand().then(res => (brand.brandlist = res.result))
    return { menuList, categoryId, curCategory }
  }
}

// 1、不要在同一标签中同时使用v-if与v-for，因此需要使用不会渲染的template容器标签来将二者"隔离"
// 2、menuList是将接口中9个商品分类数据 与 1个自定义品牌数据结合的产物，用于渲染左侧分类
// 3、鼠标移入左侧分类记录下categoryId（使用使用响应式声明），后续使用计算属性在menuList中遍历到这个分类用于弹出层商品渲染
// 4、homeBrand()调用会从服务器返回热门品牌列表，在brand中自定义字段brandlist去接收热门品牌列表，因为是响应式数据，且做了计算属性，后续会自动加到menuList中
// 5、在setup内调用异步时，不要在setup前使用async，因为setup默认不支持async关键字，因此在setup内不建议使用async与await改写异步代码
// 6、vue3组合API中修改响应式数据必须通过.value才能修改，reactive()创建的响应式对象内的属性并不是响应式的，因此brand.brandlist不需要通过.value改值或赋值
// 7、<li :class="{active: categoryId && categoryId === item.id }" ></li> 必须加上 "categoryId &&"这个前置条件 否则会将除品牌外的全部分类li标签都选中
</script>

<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  // 左侧分类列表
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      // 鼠标悬浮时会有背景色高亮，
      // 增加一个 .active类 当子级选中时为父级添加上这个.active类
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  // 左侧分类列表对应的右侧商品（弹出层）
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
