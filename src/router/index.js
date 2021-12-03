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
const Checkout = () => import('@/views/member/checkout')
const Pay = () => import('@/views/member/pay')
const PayCallback = () => import('@/views/member/pay/components/pay_callback')

const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order')
const MemberTest = () => import('@/views/member/order/test')
const MemberTest1 = () => import('@/views/member/order/components/test1')
const MemberTest2 = () => import('@/views/member/order/components/test2')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: Checkout },
      { path: '/member/pay', component: Pay },
      { path: '/pay/callback', component: PayCallback },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome },
          { path: '/member/order', component: MemberOrder },
          {
            path: '/member/test',
            component: MemberTest,
            children: [
              { path: '/member/test1', component: MemberTest1 },
              { path: '/member/test2', component: MemberTest2 }
            ]
          }
        ]
      }
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
  linkExactActiveClass: 'active',
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

// 5、src/App.vue是放置一级路由出口
// 5、对应配置的路由记录是 { path: '/', component: Layout组件 }
// 6、src/views/Layout.vue 是放置二级路由出口
// 6、对应配置的路由记录是 { path: '/', component: Layout组件, children: [ { path: '/xxx', component: member/Layout组件 } ] }
// 7、src/views/member/Layout.vue 是放置三级路由出口
// 7、对应配置的路由记录是 { path: '/', component: Layout组件, children: [ { path: '/xxx', component: member/Layout组件, children:[{ path: '/xxx', component: ... }] } ] }
// 8、linkExactActiveClass是统一配置router-link标签exact-acive-class属性进行路由切换时的精准匹配（精准匹配到哪个路由，该链接就高亮显示）
// 9、vue3中router-link标签设置active-class属性进行路由模糊匹配的坑点：必须是包含且嵌套关系的路由
