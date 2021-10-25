<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li v-for="item in list" :key="item.id">
      <a href="#">{{ item.name }}</a>
      <div class="layer">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <a href="#">
              <img :src="sub.picture" alt="" />
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()
    const list = computed(() => store.state.category.list)
    return { list }
  }
}
// 1、vue3的setup中使用vuex需要注意，直接使用对象解构vuex的state数据是没有响应式的，因此必须使用computed计算属性api来取值才有响应式

</script>

<style lang="less" scoped>
.app-header-nav {
  position: relative;
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // 鼠标悬停显示二级菜单（高度显示 透明度显示）
      > .layer {
        height: 132px;
        opacity: 1;
      }
    }
  }
}

// 二级菜单弹出层（默认状态：高度0 透明度0）
.layer {
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
