import { createApp } from 'vue'
import App from './App.vue'

import store from './store'
import router from './router'

import 'normalize.css'
import './assets/styles/common.less'

import common from './utils/common'
import plugin from './library/index'

createApp(App)
  .use(store)
  .use(router)
  .use(common)
  .use(plugin)
  .mount('#app')
