import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/auth',
    component: () => import('@/views/auth/login.vue'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/auth/register'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    meta: { requireAuth: true },
    children: [{
      path: '/index',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Home', icon: 'dashboard', visible: true }
    }]
  },
  {
    path: '/usermanager',
    component: Layout,
    children: [{
      path: '/yonghu',
      name: 'Usermanager',
      component: () => import('@/views/user/index'),
      meta: { title: 'User Management', icon: 'dashboard', visible: true, roles: ['teacher', 'admin'] }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    children: [{
      path: '/profile',
      name: 'profile',
      hidden: true,
      component: () => import('@/views/user/profile.vue'),
      meta: { title: 'Profile', visible: true, roles: ['teacher', 'admin', 'student'], icon: 'dashboard' }
    }]
  },
  {
    path: '/change-password',
    component: Layout,
    children: [{
      path: '/change-password',
      name: 'change-password',
      hidden: true,
      component: () => import('@/views/user/chane-password.vue'),
      meta: { title: 'Change Password', visible: true, roles: ['teacher', 'admin', 'student'], icon: 'dashboard' }
    }]
  },
  {
    path: '/class-management',
    component: Layout,
    children: [{
      path: '/class-management',
      name: 'class-management',
      component: () => import('@/views/class/index'),
      meta: { title: 'Class Management', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/exam-center',
    component: Layout,
    children: [{
      path: '/exam-center',
      name: 'exam-center',
      component: () => import('@/views/exam/student/index'),
      meta: { title: 'Exam Center', visible: true, roles: ['admin', 'student'], icon: 'dashboard' }
    }]
  },
  {
    path: '/exam-info',
    component: Layout,
    children: [{
      path: '/exam-info',
      name: 'exam-info',
      hidden: true,
      component: () => import('@/views/exam/exam-info.vue'),
      meta: { title: 'Prepare for Exam', visible: true, roles: ['teacher', 'admin', 'student'], icon: 'dashboard' }
    }]
  },
  {
    path: '/do-exam',
    name: 'do-exam',
    hidden: true,
    component: () => import('@/views/exam/index.vue'),
    meta: { title: 'Start Exam', visible: true, roles: ['teacher', 'admin', 'student'], icon: 'dashboard' }
  },
  {
    path: '/questcenter',
    component: Layout,
    children: [{
      path: '/shuatizx',
      name: 'Questcenter',
      component: () => import('@/views/exercise/index'),
      meta: { title: 'Exercise Center', visible: true, roles: ['admin', 'student'], icon: 'dashboard' }
    }]
  },
  {
    path: '/do-exercise',
    name: 'do-exercise',
    hidden: true,
    component: () => import('@/views/exercise/do-exercise.vue'),
    meta: { title: 'Start Exercise', visible: true, roles: ['teacher', 'admin', 'student'], icon: 'dashboard' }
  },
  {
    path: '/record',
    component: Layout,
    name: 'record',
    meta: { title: 'Records', icon: 'el-icon-s-help', visible: true, roles: ['admin', 'student'], requireAuth: true },
    children: [
      {
        path: '/exam-record',
        name: 'exam-record',
        component: () => import('@/views/record/exam/index.vue'),
        meta: { title: 'Exam Records', visible: true, roles: ['admin', 'student'], icon: 'table' }
      },
      {
        path: '/exercise-record',
        name: 'exercise-record',
        component: () => import('@/views/record/exercise/index.vue'),
        meta: { title: 'Exercise Records', visible: true, roles: ['admin', 'student'], icon: 'tree' }
      }
    ]
  },
  {
    path: '/exam-record-detail',
    component: Layout,
    children: [{
      path: '/exam-record-detail',
      name: 'exam-record-detail',
      hidden: true,
      component: () => import('@/views/record/exam/detail.vue'),
      meta: { title: 'View Questions', visible: true, roles: ['teacher', 'admin', 'student'], icon: 'dashboard' }
    }]
  },
  {
    path: '/exercise-record-detail',
    component: Layout,
    children: [{
      path: '/exercise-record-detail',
      name: 'exercise-record-detail',
      hidden: true,
      component: () => import('@/views/record/exercise/detail.vue'),
      meta: { title: 'View Exercise', visible: true, roles: ['teacher', 'admin', 'student'], icon: 'dashboard' }
    }]
  },
  {
    path: '/exam-error',
    component: Layout,
    children: [{
      path: '/exam-error',
      name: 'exam-error',
      component: () => import('@/views/userbook/index'),
      meta: { title: 'Exam Error', visible: true, roles: ['admin', 'student'], icon: 'dashboard' }
    }]
  },
  {
    path: '/review-exam',
    name: 'review-exam',
    hidden: true,
    component: () => import('@/views/userbook/review.vue'),
    meta: { title: 'Review', visible: true, roles: ['teacher', 'admin', 'student'], icon: 'dashboard' }
  },
  {
    path: '/exam-management',
    component: Layout,
    children: [{
      path: '/exam-management',
      name: 'exam-management',
      component: () => import('@/views/exam/teacher/index'),
      meta: { title: 'Exam Management', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/add-exam',
    component: Layout,
    children: [{
      path: '/add-exam',
      name: 'add-exam',
      hidden: true,
      component: () => import('@/views/exam/add-exam.vue'),
      meta: { title: 'Add Exam', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/question-bank-management',
    component: Layout,
    children: [{
      path: '/question-bank-management',
      name: 'question-bank-management',
      component: () => import('@/views/repo/index'),
      meta: { title: 'Question Bank Management', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/question-management',
    component: Layout,
    children: [{
      path: '/question-management',
      name: 'question-management',
      component: () => import('@/views/question/index'),
      meta: { title: 'Question Management', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/add-question',
    component: Layout,
    children: [{
      path: '/add-question',
      name: 'add-question',
      hidden: true,
      component: () => import('@/views/question/add.vue'),
      meta: { title: 'Question Addition', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/certificate',
    component: Layout,
    children: [{
      path: '/certificate',
      name: 'certificate',
      component: () => import('@/views/certificate/certificate.vue'),
      meta: { title: 'Certificate Management', visible: true, roles: ['admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/my-certificate',
    component: Layout,
    children: [{
      path: '/my-certificate',
      name: 'my-certificate',
      component: () => import('@/views/certificate/my-certificate.vue'),
      meta: { title: 'My Certificates', icon: 'dashboard', visible: true, roles: ['student'] }
    }]
  },
  {
    path: '/score-analysis',
    component: Layout,
    children: [{
      path: '/score-analysis',
      name: 'score-analysis',
      component: () => import('@/views/score/index'),
      meta: { title: 'Score Analysis', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/score-detail',
    component: Layout,
    children: [{
      path: '/score-detail',
      name: 'score-detail',
      hidden: true,
      component: () => import('@/views/score/detail'),
      meta: { title: 'Score Detail', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/answer-management',
    component: Layout,
    children: [{
      path: '/answer-management',
      name: 'answer-management',
      component: () => import('@/views/answer/index'),
      meta: { title: 'Answer Management', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/answer-d',
    component: Layout,
    children: [{
      path: '/answerck',
      name: 'Ansck',
      hidden: true,
      component: () => import('@/views/answer/answerck'),
      meta: { title: 'Answer Check', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/makeTest',
    component: Layout,
    children: [{
      path: '/makeTest',
      name: 'make',
      hidden: true,
      component: () => import('@/views/answer/makeTest'),
      meta: { title: 'Grade Tests', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },
  {
    path: '/notice',
    component: Layout,
    children: [{
      path: 'notice1',
      name: 'Notice',
      component: () => import('@/views/notice/notice'),
      meta: { title: 'Notice Management', visible: true, roles: ['teacher', 'admin'], icon: 'dashboard' }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
