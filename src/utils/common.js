import AppNav from '../components/appNav'
import AppHeader from '../components/appHeader'

export default function (Vue, options) {
  Vue.component(AppNav.name, AppNav)
  Vue.component(AppHeader.name, AppHeader)
}
