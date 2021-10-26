<template>
  <div class="home-category">
    <!-- 左侧分类列表 -->
    <ul class="menu">
      <li v-for="item in menuList" :key="item.id"  @mouseenter="categoryId=item.id">
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <template v-if="item.children">
           <RouterLink :to="`/category/sub/${sub.id}`" v-for="sub in item.children" :key="sub.id">{{ sub.name }}</RouterLink>
        </template>
      </li>
    </ul>
    <!-- 左侧分类列表对应的右侧商品（弹出层） -->
    <div class="layer">
      <h4>分类推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <ul v-if="curCategory && curCategory.goods">
        <li v-for="item in curCategory.goods" :key="item.id">
          <RouterLink :to="`/`">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HomeCategory',
  setup () {
    const store = useStore()

    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-children', name: '品牌推荐' }]
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

    return { menuList, categoryId, curCategory }
  }
}

// 1、不要在同一标签中同时使用v-if与v-for，因此需要使用不会渲染的template容器标签来将二者"隔离"
// 2、menuList是将接口中9个商品分类数据 与 1个自定义品牌数据结合的产物，用于渲染左侧分类
// 3、鼠标移入左侧分类记录下categoryId（使用使用响应式声明），后续使用计算属性在menuList中遍历到这个分类用于弹出层商品渲染
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
      &:hover {
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
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
