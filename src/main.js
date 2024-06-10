import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import html2pdf from '@/utils/html2pdf'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css
import echarts from 'echarts'
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import axios from 'axios'
import { getToken } from './utils/auth'
// Rich text editor
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // Import styles
import 'quill/dist/quill.snow.css' // Snow theme
import 'quill/dist/quill.bubble.css' // Bubble theme

// Define whitelist
Vue.prototype.$echarts = echarts
const whiteList = ['/auth', '/register']

router.beforeEach((to, from, next) => {
  // Get token, here it's taken from localStorage as an example
  const token = getToken('Authorization')

  // Check if the current route is in the whitelist
  if (whiteList.includes(to.path)) {
    // If in the whitelist, token is not required, allow access directly
    next()
  } else {
    // If not in the whitelist, check the token
    if (!token) {
      // If no token, redirect to auth page and carry the full path to redirect after auth
      next({ path: '/auth', query: { redirect: to.fullPath }})
    } else {
      // If token is present, allow access
      next()
    }
  }
})

axios.defaults.withCredentials = true

/**
 * If you don't want to use mock-server
 * and want to use MockJs for mock API
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
Vue.use(html2pdf)
// Rich text editor
Vue.use(VueQuillEditor /* { default global options } */)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// If you want to use Chinese version of element-ui, declare as follows
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
