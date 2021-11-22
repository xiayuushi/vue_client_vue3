<template>
  <Form class="xxx-form" :validation-schema="schema" v-slot="{ errors }" ref="target">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xxx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field class="input" type="text" placeholder="绑定的手机号" v-model="form.mobile" name="mobile" />
      </div>
      <div :class="{ error: errors.mobile }" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xxx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field class="input" type="text" placeholder="短信验证码" v-model="form.code" name="code" />
        <span class="code" @click="sendCode">{{ time === 0 ? '发送验证码' : `请${ time }后再试` }}</span>
      </div>
      <div :class="{ error: errors.code }" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="bindAccount">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { userQQbindAccount, userQQBindCode } from '@/api/user'
import veeSchema from '@/utils/vee_validate_schema'
import Message from '@/library/Message/index.js'

export default {
  name: 'LoginCallbackBind',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: { Form, Field },
  setup (props) {
    const avatar = ref(null)
    const nickname = ref(null)
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl
        nickname.value = res.data.nickname
      })
    }

    const form = reactive({
      mobile: null,
      code: null
    })
    const schema = {
      mobile: veeSchema.mobile,
      code: veeSchema.code
    }

    const target = ref(null)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, { immediate: false })
    onUnmounted(() => pause())

    const sendCode = async () => {
      const valid = schema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          try {
            time.value = 60
            resume()
            await userQQBindCode(form.mobile)
            Message({ type: 'success', text: '验证码发送成功' })
          } catch (err) {
            if (err.response.data) {
              Message({ type: 'error', text: err.response.data.message || '获取验证码失败' })
            }
          }
        }
      } else {
        target.value.setFieldError('mobile', valid)
      }
    }

    const store = useStore()
    const router = useRouter()
    const bindAccount = async () => {
      const valid = target.value.validate()
      if (valid) {
        try {
          const res = await userQQbindAccount({ unionId: props.unionId, mobile: form.mobile, code: form.code })
          const { id, avatar, nickname, account, mobile, token } = res.result
          store.commit('user/SETUSER', { id, avatar, nickname, account, mobile, token })
          Message({ type: 'success', text: 'QQ绑定账号成功' })
          router.push(store.state.user.redirect || '/')
        } catch (err) {
          console.dir(err)
          if (err.response.data) {
            Message({ type: 'error', text: err.response.data.message || 'QQ绑定账号失败' })
          }
        }
      } else {
        Message({ type: 'error', text: '手机号或验证码有误' })
      }
    }

    return { nickname, avatar, form, schema, sendCode, time, target, bindAccount }
  }
}

// 1、QC.api('get_user_info')是QQ登录SDK提供的API用于获取QQ用户信息
</script>

<style lang="less" scoped>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
  .code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
      cursor: pointer;
    }
  }
</style>
