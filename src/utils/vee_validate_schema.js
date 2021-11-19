// import { userAccountCheck } from '@/api/user'

export default {
  account (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },

  // async accountApi (value) {
  //   if (!value) return '请输入用户名'
  //   if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
  //   const data = await userAccountCheck(value)
  //   if (data.result.valid) return '用户名已存在'
  //   return true
  // },

  password (value) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码6-24个字符'
    return true
  },

  rePassword (value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码6-24个字符'
    if (value !== form.password) return '需要和密码保持一致'
    return true
  },
  mobile (value) {
    if (!value) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不对'
    return true
  },

  code (value) {
    if (!value) return '请输入短信验证码'
    if (!/^\d{6}$/.test(value)) return '短信验证码6个数字'
    return true
  },

  isAgree (value) {
    if (!value) return '请勾选登录协议'
    return true
  }
}

// 1、当前文件是使用vee-validate做表单校验的校验规则
// 2、之所以将规则提取整合到一个文件中，是为了后续在使用vee-validate进行表单验证时能够复用
