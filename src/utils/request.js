import axios from 'axios'
import store from '../store'
import router from '../router'
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  config => {
    const { profile } = store.state.user
    if (profile.token) {
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  res => res.data,
  err => {
    const fullPath = encodeURIComponent(router.current.value.fullPath)
    if (err.response && err.response.status === 401) {
      store.commit('SETUSER', {})
      router.push('/login?redirect=' + fullPath)
    }
    return Promise.reject(err)
  }
)

function _instance (payload) {
  return new Promise((resolve, reject) => {
    instance(payload)
      .then(res => resolve(res))
      .catch(err => console.log(err))
  })
}

export default (url, method, val) => {
  return _instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: val
  })
}

// 1、之所以将基地址导出，是因为可能其他不使用aixos发请求的地方也会用到该地址，如服务器上传的时候，导出便于后续使用
// 2、vue2中可以在.js中使用 router.current.fullPath获取完整的含参数的路由信息
// 3、vue3中 router.current已经被ref()包装成一个响应式数据，取值须经过'.value' 因此router.current.value.fullPath才能取完整的路由信息
// 4、路径中如果有特殊字符会影响 router.query 获取路由参数， 因此必须使用 原生JS的recodeURIComponent()对路由参数进行转义
// 5、定义_instance函数让自定义封装的api出错时，不让其在控制台抛错
