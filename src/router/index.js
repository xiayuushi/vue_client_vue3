import store from '@/store'
import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')
const Login = () => import('@/views/login')
const LoginCallback = () => import('@/views/login/components/login_callback')
const Cart = () => import('@/views/cart')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (!store.state.user.profile.token && to.path.startsWith('/member')) {
    next('/login?redirect=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router

// 1、路由实例对象内配置 scrollBehavior 可以设置路由跳转到新页面时的滚动位置
// 2、scrollBehavior 与 routes 写在同一级中
// 3、vue2与vue3配置路由实例对象的scrollBehavior配置的区别
// D1、vue2中路由实例中的 scrollBehavior 返回的对象属性x与y 分别代表x轴与y轴的滚动距离
// D2、vue3中路由实例中的 scrollBehavior 返回的对象属性left与top 分别代表x轴与y轴的滚动距离
// 4、用户未登录访问以'/member'开头的限制级页面会被路由前置守卫拦截到登录页（登录成功后会直接前往目标页面，需要在组件跳转中router.push()到目标页）
