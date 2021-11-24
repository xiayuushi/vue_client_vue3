import { getLatestCartGoods } from '@/api/cart'

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
    },
    UPDATECART (state, payload) {
      const updateItem = state.list.find(item => item.skuId === payload.skuId)
      for (const key in payload) {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
          updateItem[key] = payload[key]
        }
      }
    },
    DELETECART (state, skuId) {
      const deleteIndex = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(deleteIndex, 1)
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
    },
    queryCart (store) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          const skuidList = store.state.list.map(item => item.skuId)
          const promiseList = []
          skuidList.forEach(item => {
            promiseList.push(getLatestCartGoods(item))
          })
          Promise.all(promiseList).then(resList => {
            resList.forEach((res, i) => {
              store.commit('UPDATECART', { skuId: skuidList[i], ...res.result })
            })
            resolve()
          }).catch(err => reject(err))
        }
      })
    },
    deleteCart (store, payload) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          store.commit('DELETECART', payload)
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
    validListAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    invalidList (state) {
      return state.list.filter(item => item.stock <= 0 || !item.isEffective)
    },
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    selectedListCounts (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    selectedListAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    isCheckedAll (state, getters) {
      return getters.selectedList.length !== 0 && getters.selectedList.length === getters.validList.length
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

// 9、validList购物车列表的有效商品，validListCounts计算购物车列表的有效商品总数量，validListAmount计算购物车列表的有效商品总价格
// 10、validListAmount计算购物车列表的有效商品总价格时之所以先'*100'再'/100'是为了计算浮点数，且保留两位小数

// 11、UPDATECART用于更新购物车，形参payload就是传入的用于更新购物车列表中某个商品的更新对象，updateItem就是购物车商品列表中的某个待更新商品
// 11、传入的更新对象，字段不固定（或者说可能不完整），例如购物车某个商品中有10个字段，有可能payload实参传入的只有6个字段
// 11、传入的更新对象，字段的值可能不合法，例如购物车商品中有count字段用于表示商品数量，有可能payload实参传入的count属性是个undefined
// 11、因此必须确保更新购物车数据时，传入的payload中必须有skuId，另外传入的字段的值必须有效
// 11、for..in..传入哪些字段就改哪些字段，另外resList遍历时它可以溯源至store.state.list这个数组，因此可以它们两者的索引是一致的，也可以用于取数组中skuId的值
// 12、getLatestCartGoods接口用于更新最新的购物车数据，每次只能更新一个sku商品
// 12、queryCart用于查询购物车商品，也需要分两种情况（未登录时本地购物车信息 、已登录时购物车信息）
// 12、正因为每次只能查询一个sku商品，购物车列表可能有多个sku商品，因此需要等到所有接口返回数据再将结果一并返回，此时就需要使用Promise.all()

// N1、在vuex中的actions中去区分用户未登录与已登录时购物车的情况，在组件上只需调用actions即可
