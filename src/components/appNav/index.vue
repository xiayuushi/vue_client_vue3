<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile && profile.token">
          <li><a href="javascript:void(0);"><i class="iconfont icon-user"></i>{{ profile.account }}</a></li>
          <li><a href="javascript:void(0);" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
          <li><router-link to="/login">请先登录</router-link></li>
          <li><a href="javascript:void(0);">免费注册</a></li>
        </template>
        <li><a href="javascript:void(0);">我的订单</a></li>
        <li><a href="javascript:void(0);">会员中心</a></li>
        <li><a href="javascript:void(0);">帮助中心</a></li>
        <li><a href="javascript:void(0);">关于我们</a></li>
        <li><a href="javascript:void(0);"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'AppTopnav',
  setup () {
    const store = useStore()
    const profile = computed(() => store.state.user.profile)

    const router = useRouter()
    const logout = () => {
      store.commit('user/SETUSER', {})
      store.commit('cart/SETCART', [])
      router.push('/login')
    }

    return { profile, logout }
  }
}
</script>

<style lang="less" scoped>
.app-topnav {
  background-color: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}

// 1、template标签可以当成元素的容器，但又不会解析该标签，因此在某些时候非常好用
// 2、~选择器表示选择其后的所有元素，此处表示选中li标签后面所有的标签
// 3、~选择器非常好用（假设有3个兄弟元素并列，在第一个元素后用该选择器，则会选中该元素后面所有的元素）
// 4、在vue3的setup中如果直接将vuex的数据以对象解构取出，则取出的vuex对象属性不具有响应式效果，因此必须使用计算属性
</style>
