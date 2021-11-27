<template>
  <Form class="xxx-form" :validation-schema="schema" v-slot="{ errors }" ref="target">
    <div class="xxx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field class="input" type="text" placeholder="请输入用户名" v-model="form.account" name="account" />
      </div>
      <div class="error" v-if="errors.account">{{ errors.account }}</div>
    </div>
    <div class="xxx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field class="input" type="text" placeholder="请输入手机号" v-model="form.mobile" name="mobile" />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xxx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field class="input" type="text" placeholder="请输入验证码" v-model="form.code" name="code" />
        <span class="code" @click="sendCode">{{ time === 0 ? '发送验证码' : `请${ time }秒后再试` }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xxx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field class="input" type="password" placeholder="请输入密码" v-model="form.password" name="password" />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xxx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field class="input" type="password" placeholder="请确认密码" v-model="form.rePassword" name="rePassword" />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { ref, reactive, onUnmounted } from 'vue'
import { registerCode, userQQPatchLogin } from '@/api/user'
import Message from '@/library/Message/index.js'
import veeSchema from '@/utils/vee_validate_schema'

export default {
  name: 'LoginCallbackPatch',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: { Form, Field },
  setup (props) {
    const form = reactive({
      account: null,
      password: null,
      rePassword: null,
      mobile: null,
      code: null
    })
    const schema = {
      account: veeSchema.accountApi,
      password: veeSchema.password,
      rePassword: veeSchema.rePassword,
      mobile: veeSchema.mobile,
      code: veeSchema.code
    }

    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, { immediate: false })
    onUnmounted(() => pause())

    const store = useStore()
    const router = useRouter()
    const target = ref(null)
    const sendCode = async () => {
      const valid = schema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          try {
            time.value = 60
            resume()
            await registerCode(form.mobile)
            Message({ type: 'success', text: '发送验证码成功' })
          } catch (err) {
            if (err.response.data) {
              Message({ type: 'error', text: err.response.data.message || '发送验证码失败' })
            }
          }
        }
      } else {
        target.value.setFieldError('mobile', valid)
      }
    }

    const submit = async () => {
      const valid = target.value.validate()
      if (valid) {
        try {
          const res = await userQQPatchLogin({ unionId: props.unionId, ...form })
          const { id, avatar, nickname, account, mobile, token } = res.result
          store.commit('user/SETUSER', { id, avatar, nickname, account, mobile, token })
          store.dispatch('cart/mergeCart').then(() => {
            Message({ type: 'success', text: '完善信息成功' })
            router.push(store.state.user.redirect || '/')
          })
        } catch (err) {
          if (err.response.data) {
            Message({ type: 'error', text: err.response.data.message || '完善信息失败' })
          }
        }
      } else {
        Message({ type: 'error', text: '请正确填写注册信息' })
      }
    }
    return { form, schema, target, sendCode, submit, time }
  }
}

// 1、表单校验与之前相比有两个地方有区别：
// 1、1 须验证用户名是否惟一（调用服务器接口验证）
// 1、2 再次输入密码是否一致
// 2、vee-validate规则对象，即 :validation-schema绑定的规则对象，内部各字段的函数有形参
// 2、1 第一形参是被验证的某个字段的值，
// 2、2 第二形参对象可以解构出被验证的整个form表单，可通过该form表单获取某个验证字段用于密码是否一致的验证
</script>

<style lang="less" scoped>
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
