<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="has-bind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{ active: hasAccount }" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{ active: !hasAccount }" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <LoginCallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <LoginCallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { userQQLogin } from '@/api/user'

import QC from 'qc'
import LoginHeader from './login_header'
import LoginFooter from './login_footer'
import Message from '@/library/Message/index.js'
import LoginCallbackBind from './login_callback_bind'
import LoginCallbackPatch from './login_callback_patch'

export default {
  name: 'LoginCallback',
  components: { LoginHeader, LoginFooter, LoginCallbackBind, LoginCallbackPatch },
  setup () {
    const unionId = ref(null)
    const isBind = ref(true)
    const hasAccount = ref(true)
    const store = useStore()
    const router = useRouter()

    if (QC.Login.check()) {
      QC.Login.getMe(async (openId) => {
        unionId.value = openId
        try {
          const res = await userQQLogin(openId)
          const { id, avatar, nickname, account, mobile, token } = res.result
          store.commit('user/SETUSER', { id, avatar, nickname, account, mobile, token })
          store.dispatch('cart/mergeCart').then(() => {
            router.push(store.state.user.redirect || '/')
            Message({ type: 'success', text: '登录成功' })
          })
        } catch (err) {
          if (err.response.data) {
            Message({ type: 'error', text: err.response.data.message || '第三方登录失败' })
          }
          isBind.value = false
        }
      })
    }
    return { isBind, hasAccount, unionId }
  }
}

// 1、QC.Login.check() 是QQ登录SDK中的API，判断是否采用QQ登录作为第三方登录
// 2、QC.Login.getMe(回调) 是QQ登录SDK中的API，用于获取openId（该API回调中的第一形参就是openId）
// 2、QC.Login.getMe(回调) 必定能够获取openId，因此无需判断没有openId的情况（只要用户进行QQ扫码一定可以获取openId）
// 3、有openId，此时调用后端提供的第三方登录接口进行登录
// 3、结果1：登录成功（使用QQ登录成功直接跳转来源页或者首页）
// 3、结果2：登录失败（使用QQ登录失败有两种情况 Q1没绑定账号 Q2没有账号）
// 4、使用QQ登录SDK的API之前，必须做的两件事
// 4、1 必须在项目静态页中引入SDK并在引入SDK的script标签中设置appid与回调地址
// 4、2 必须配置webpack忽略打包该SDK（避免qc模块引入报错、避免全局变量QC报错、避免打包该SDK到项目中）
</script>

<style lang="less" scoped>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
// loading
.has-bind {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 25px 0;
  z-index: 99;
  .loading {
   height: 100%;
   background: #fff url('~@/assets/images/load.gif') no-repeat center / 100px 100px;
  }
}
</style>
