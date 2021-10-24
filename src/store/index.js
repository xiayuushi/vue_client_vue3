import { createStore } from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    cart,
    category
  },
  plugins: [
    createPersistedstate({
      key: 'vue_client_mall',
      paths: ['user', 'cart']
    })
  ]
})
