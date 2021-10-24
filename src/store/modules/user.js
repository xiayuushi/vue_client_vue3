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
      }
    }
  },
  mutations: {
    SETUSER (state, payload) {
      state.profile = payload
    }
  }
}

// 1、将state定义成函数形式可以避免内部名称与其他模块的名称冲突（与定义成对象形式是类似的）
