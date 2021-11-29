import { getLatestCartGoods, memberCartMerge, memberCart, memberCartDelete, memberCartAdd, memberCartPut, memberCartSelected } from '@/api/cart'

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
    },
    SETCART (state, payload) {
      state.list = payload
    }
  },
  actions: {
    insertCart (store, payload) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          memberCartAdd(payload.skuId, payload.count)
            .then(() => memberCart())
            .then(res => store.commit('INSERTCART', res.result))
          resolve()
        } else {
          store.commit('INSERTCART', payload)
          resolve()
        }
      })
    },
    queryCart (store) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          memberCart().then(res => (store.commit('SETCART', res.result)))
          resolve()
        } else {
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
          memberCartDelete([payload])
            .then(() => memberCart())
            .then(res => (store.commit('SETCART', res.result)))
        } else {
          store.commit('DELETECART', payload)
          resolve()
        }
      })
    },
    updateCart (store, payload) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          memberCartPut(payload.skuId, payload.selected, payload.count)
            .then(() => memberCart())
            .then(res => store.commit('SETCART', res.result))
          resolve()
        } else {
          store.commit('UPDATECART', payload)
          resolve()
        }
      })
    },
    checkAllCart (store, payload) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          const ids = store.getters.validList.map(item => item.skuId)
          memberCartSelected(ids, payload.selected)
            .then(() => memberCart())
            .then(res => store.commit('SETCART', res.result))
          resolve()
        } else {
          store.getters.validList.forEach(item => {
            store.commit('UPDATECART', { skuId: item.skuId, selected: payload.selected })
          })
          resolve()
        }
      })
    },
    batchDeleteCart (store, isClearInvalid) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          const skuIdList = store.getters[isClearInvalid ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          memberCartDelete(skuIdList)
            .then(() => memberCart(skuIdList))
            .then(res => store.commit('SETCART', res.result))
        } else {
          store.getters[isClearInvalid ? 'invalidList' : 'selectedList'].forEach(item => {
            store.commit('DELETECART', item.skuId)
          })
          resolve()
        }
      })
    },
    updateCartSku (store, { newSku, oldSkuId }) {
      return new Promise((resolve, reject) => {
        if (store.rootState.user.profile.token) {
          const oldGoods = store.state.list.find(item => item.skuId === oldSkuId)
          memberCartDelete([oldSkuId])
            .then(() => memberCartAdd(newSku.skuid, oldGoods.count))
            .then(() => memberCart())
            .then(res => store.commit('SETCART', res.result))
          resolve()
        } else {
          const oldGoods = store.state.list.find(item => item.skuId === oldSkuId)
          store.commit('DELETECART', oldSkuId)
          const { skuid: skuId, inventory: stock, price: nowPrice, oldPrice: price, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, stock, nowPrice, price, attrsText }
          store.commit('INSERTCART', newGoods)
          resolve()
        }
      })
    },
    async mergeCart (store) {
      const payloadList = store.state.list.map(item => ({ skuId: item.skuId, selected: item.selected, count: item.count }))
      await memberCartMerge(payloadList)
      store.commit('SETCART', [])
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
// 11、因为for..in..遍历对象也可以筛选不合法数据字段，当符合购物车商品的数据字段才能够正确改值，后续传参必须传商品相关字段否则一律修改不成功
// 12、getLatestCartGoods接口用于更新最新的购物车数据，每次只能更新一个sku商品
// 12、queryCart用于查询购物车商品，也需要分两种情况（未登录时本地购物车信息 、已登录时购物车信息）
// 12、正因为每次只能查询一个sku商品，购物车列表可能有多个sku商品，因此需要等到所有接口返回数据再将结果一并返回，此时就需要使用Promise.all()

// 13、mergeCart合并购物车的逻辑：1 调用接口合并本地购物车 2 合并成功清空本地购物车
// 14、在多个登录渠道调用该actions方法清空购物车
// 14、例如：账号密码或手机号验证码登录的login.vue、第三方登录已绑定账号login_callback.vue、第三方登录未绑定已注册账号login_callback_bind.vue、第三方登录未注册账号login_callback_patch）
// 15、在退出登录时则应该调用mutations方法SETCART置空购物车
// 15、例如：src/components/AppNav.vue中退出登录的逻辑内 store.commit('cart/SETCART')
// 16、因为vuex做了持久化处理，清空本地购物车则也会把线上购物车清空，以上流程完成后再登录时会发现购物车都是空的，因此需要后续调用接口重新请求购物车列表数据

// N1、在vuex中的actions中去区分用户未登录与已登录时购物车的情况，在组件上只需调用actions即可
// N2、const { x: xx } = obj 表示从obj中解构出x属性赋值给xx，即等同于 const xx = obj.x
// N3、匹配旧的SKU对应的商品，删除旧SKU商品，转成与vuex中定义的与接口一致的字段合并成最新的SKU数据（合并的SKU数据会形成新的SKU商品），重新加入购物车
// N4、mergeCart合并购物车一定是登录后才做的，该actions方法只会在登录成功时去调用，因此无需在actions方法内部做判断
// N5、使用async的函数，其返回值就是一个Promise对象，可以通过.then监听其成功的回调
// N5、因此actions方法名前使用async后，在组件调用该actions时可以.then()在其触发成功后的进行后续逻辑的处理
// N6、Promise.then()如果返回的是一个Promise对象，则可以继续使用.then()，并在.then()的回调形参中接收到上一个Promise的返回值
// N6、例如 Promise.then(()=>return API接口).then(res => 此时res就是API接口的返回数据)
// N7、batchDeleteCart与deleteCart函数中，如果用户已登录状态，则分别会调用接口删除购物车数据（前者是批量删除、后者是单个删除）
// N7、删除后会重新调用服务器接口memberCart去请求最新的购物车列表数据，请求回数据后再重新设置给购物车列表进行渲染
// N8、actions.insertCart方法中，用户登录后调用memberCartAdd接口去将商品添加到购物车
// N8、后面两个.then()也可以只写 .then(res => store.commit('INSERTCART', res.result))
// N8、之所以在此之前多加一个.then()去调用memberCart接口，是为了应变更加复杂的情况（调用接口可以解决意外情况发生）
// N9、memberCartDelete(skuIdList).then(() => memberCart(skuIdList)).then(res => store.commit('SETCART', res.result))
// N9、线上操作接口后的两个.then()中memberCart是查询购物车最新状态，而'SETCART'是将最新状态数据设置给购物车
// N10、updateCartSku更改购物车商品中的规格，登录状态与未登录状态的流程是类似的：区别在于是否更改服务器的规格
// N10、登录状态：找到旧商品，删除旧商品、将新skuId与旧商品count以调用接口的方式重新添加到购物车、查询最新购物车列表后，将新数据设置给购物车实现更新规格的目的
// N10、未登录状态：找到旧商品，删除旧商品、将本地选择好的新商品SKU以本地mutations.INSERTCART的方式重新插入到购物车实现更新规格的目的
