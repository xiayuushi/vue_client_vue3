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
            .then(res => store.commit('SETCART', res.result))
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

// 1????????????????????????????????????????????????????????????????????????????????????????????????
// 2?????????????????????vuex??????actions???????????????????????????????????????actions?????????
// 3??????actions?????????user???????????????????????????
// 3???Q1 ??????????????????mutations??????vuex?????????????????????vuex???????????????????????????????????????????????????
// 3???Q2 ??????????????????api????????????????????????????????????????????????mutations??????vuex????????????????????????????????????????????????
// 4?????????????????????????????????????????????promise???????????????????????????????????????????????????????????????????????????????????????

// 5?????????????????????????????????????????????????????????
// 6?????????????????????vuex???????????????????????????????????????

// 7????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
// 7????????????id, skuId, name, attrsText, picture, price, nowPrice, selected, stock, count, isEffective
// 8???????????????????????????????????????????????????sku?????????????????????
// 8???Q1 ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
// 8???Q1 ?????????????????????????????????????????????????????????????????????????????????????????????????????????

// 9???validList?????????????????????????????????validListCounts????????????????????????????????????????????????validListAmount?????????????????????????????????????????????
// 10???validListAmount????????????????????????????????????????????????????????????'*100'???'/100'????????????????????????????????????????????????

// 11???UPDATECART??????????????????????????????payload???????????????????????????????????????????????????????????????????????????updateItem??????????????????????????????????????????????????????
// 11????????????????????????????????????????????????????????????????????????????????????????????????????????????10?????????????????????payload?????????????????????6?????????
// 11????????????????????????????????????????????????????????????????????????????????????count??????????????????????????????????????????payload???????????????count????????????undefined
// 11?????????????????????????????????????????????????????????payload????????????skuId??????????????????????????????????????????
// 11???for..in..?????????????????????????????????????????????resList???????????????????????????store.state.list??????????????????????????????????????????????????????????????????????????????????????????skuId??????
// 11?????????for..in..????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
// 12???getLatestCartGoods?????????????????????????????????????????????????????????????????????sku??????
// 12???queryCart?????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????
// 12????????????????????????????????????sku???????????????????????????????????????sku???????????????????????????????????????????????????????????????????????????????????????????????????Promise.all()

// 13???mergeCart???????????????????????????1 ????????????????????????????????? 2 ?????????????????????????????????
// 14?????????????????????????????????actions?????????????????????
// 14??????????????????????????????????????????????????????login.vue?????????????????????????????????login_callback.vue??????????????????????????????????????????login_callback_bind.vue?????????????????????????????????login_callback_patch???
// 15????????????????????????????????????mutations??????SETCART???????????????
// 15????????????src/components/AppNav.vue??????????????????????????? store.commit('cart/SETCART')
// 16?????????vuex??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

// N1??????vuex??????actions???????????????????????????????????????????????????????????????????????????????????????actions??????
// N2???const { x: xx } = obj ?????????obj????????????x???????????????xx??????????????? const xx = obj.x
// N3???????????????SKU???????????????????????????SKU??????????????????vuex??????????????????????????????????????????????????????SKU??????????????????SKU?????????????????????SKU?????????????????????????????????
// N4???mergeCart????????????????????????????????????????????????actions?????????????????????????????????????????????????????????actions?????????????????????
// N5?????????async????????????????????????????????????Promise?????????????????????.then????????????????????????
// N5?????????actions??????????????????async????????????????????????actions?????????.then()???????????????????????????????????????????????????
// N6???Promise.then()????????????????????????Promise??????????????????????????????.then()?????????.then()????????????????????????????????????Promise????????????
// N6????????? Promise.then(()=>return API??????).then(res => ??????res??????API?????????????????????)
// N7???batchDeleteCart???deleteCart??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
// N7??????????????????????????????????????????memberCart?????????????????????????????????????????????????????????????????????????????????????????????????????????
// N8???actions.insertCart?????????????????????????????????memberCartAdd????????????????????????????????????
// N8???????????????.then()??????????????? .then(res => store.commit('INSERTCART', res.result))
// N8????????????????????????????????????.then()?????????memberCart?????????????????????????????????????????????????????????????????????????????????????????????
// N9???memberCartDelete(skuIdList).then(() => memberCart(skuIdList)).then(res => store.commit('SETCART', res.result))
// N9?????????????????????????????????.then()???memberCart????????????????????????????????????'SETCART'??????????????????????????????????????????
// N10???updateCartSku????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
// N10????????????????????????????????????????????????????????????skuId????????????count?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
// N10???????????????????????????????????????????????????????????????????????????????????????SKU?????????mutations.INSERTCART????????????????????????????????????????????????????????????
// N11????????????new Promise()??????????????????async???await?????????????????????????????????????????????????????????.then()???????????????async???await???????????????????????????????????????????????????
