import AppNav from '../components/AppNav'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import AppHeaderNav from '../components/AppHeaderNav'
import AppHeaderSticky from '../components/AppHeaderSticky'

export default function (Vue, options) {
  Vue.component(AppNav.name, AppNav)
  Vue.component(AppHeader.name, AppHeader)
  Vue.component(AppFooter.name, AppFooter)
  Vue.component(AppHeaderNav.name, AppHeaderNav)
  Vue.component(AppHeaderSticky.name, AppHeaderSticky)
}
