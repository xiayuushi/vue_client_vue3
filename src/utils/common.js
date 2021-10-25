import AppNav from '../components/appNav'
import AppHeader from '../components/appHeader'
import AppFooter from '../components/appFooter'

export default function (Vue, options) {
  Vue.component(AppNav.name, AppNav)
  Vue.component(AppHeader.name, AppHeader)
  Vue.component(AppFooter.name, AppFooter)
}
