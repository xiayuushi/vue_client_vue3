export default {
  namespaced: true,
  state () {
    return {
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      redirect: ''
    }
  },
  mutations: {
    SETUSER (state, payload) {
      state.profile = payload
    },
    SETREDIRECT (state, url) {
      state.redirect = url
    }
  }
}

// 1、将state定义成函数形式可以避免内部名称与其他模块的名称冲突（与定义成对象形式是类似的）
// 2、redirect是设置回跳地址，要与工具函数响应拦截器401错误判断时的字段命名保持一致，方便后续使用route.query获取
