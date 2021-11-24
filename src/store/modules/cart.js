export default {
  namespaced: true,
  state () {
    return {
      list: []
    }
  },
  mutations: {
    INSERTCART (state, payload) {
      const sameIndex = state.list.findIndex(item => (item.skuId === payload.skuId))
      if (sameIndex > -1) {
        const { count } = state.list[sameIndex]
        payload.count += count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(payload)
    }
  },
  actions: {
    insertCart (store, payload) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          store.commit('INSERTCART', payload)
          resolve()
        }
      })
    }
  },
  getters: {
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    validListCounts (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    validListTotalPrice (state, getters) {
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    }
  }
}

// 1、购物车的各种操作都会有两种状态的区分，但是不会在组件中去区分。
// 2、而是在封装在vuex中的actions中去区分，在组件上只需调用actions即可。
// 3、在actions中通过user信息去区分登录状态
// 3、Q1 未登录，通过mutations修改vuex中的数据即可，vuex已经实现持久化，会同步保持在本地。
// 3、Q2 已登录，通过api接口去服务端操作，响应成功后通过mutations修改vuex中的数据即可，它也会同步在本地。
// 4、不管何种操作何种状态返回一个promise，然后组件能够判断操作是否完毕是否成功，再而去做其他事情。

// 5、登录后，需要合并本地购物车到服务端。
// 6、退出后，清空vuex数据也会同步清空本地数据。

// 7、需要约定添加到购物车的每个商品对象需要哪些数据字段，必须与添加购物车接口返回的数据字段保持一致
// 7、例如：id, skuId, name, attrsText, picture, price, nowPrice, selected, stock, count, isEffective
// 8、从购物车列表中查找当前正在添加的sku商品是否已存在
// 8、Q1 存在（说明购物车已有相同规格的商品），从购物车列表删除之前的同规格商品，累加之前的数量，重新添加该规格商品并挪到购物车列表最前面（最新添加的商品放到最前面）
// 8、Q1 不存在（说明该规格的商品是初次添加），直接添加移到到购物车列表的最前边

// 9、validList购物车列表的有效商品，validListCounts计算购物车列表的有效商品总数量，validListTotalPrice计算购物车列表的有效商品总价格
// 10、validListTotalPrice计算购物车列表的有效商品总价格时之所以先'*100'再'/100'是为了计算浮点数，且保留两位小数
