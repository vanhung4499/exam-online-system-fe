import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/auth'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (to.path == '/auth' || to.path == '/') {
    next()
  } else {
    store.commit('menu/ADD_TAG', {
      path: to.path,
      checked: false,
      title: to.meta.title
    })
  }
  next()

  //   if (hasToken) {
  //     if (to.path === '/auth') {
  //       // if is logged in, redirect to the home page
  //       next({ path: '/' })
  //       NProgress.done()
  //     } else {
  //       const hasGetUserInfo = store.getters.name
  //       if (hasGetUserInfo) {
  //         next()
  //       } else {
  //         try {
  //           // get user info
  //           await store.dispatch('user/getInfo')

  //           next()
  //         } catch (error) {
  //           // remove token and go to auth page to re-auth
  //           await store.dispatch('user/resetToken')
  //           Message.error(error || 'Has Error')
  //           next(`/auth?redirect=${to.path}`)
  //           NProgress.done()
  //         }
  //       }
  //     }
  //   } else {
  //     /* has no token*/

  //     if (whiteList.indexOf(to.path) !== -1) {
  //       // in the free auth whitelist, go directly
  //       next()
  //     } else {
  //       // other pages that do not have permission to access are redirected to the auth page.
  //       next(`/auth?redirect=${to.path}`)
  //       NProgress.done()
  //     }
  //   }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
