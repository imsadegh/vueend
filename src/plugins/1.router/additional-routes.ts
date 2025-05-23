import type { RouteRecordRaw } from 'vue-router/auto'

const emailRouteComponent = () => import('@/pages/apps/email/index.vue')

// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie<Record<string, unknown> | null | undefined>('userData')
      const userRole = userData.value?.role

      if (userRole === 'admin')
        // return { name: 'dashboards-crm' }
        return { name: 'dashboards-lms-admin' }
      if (userRole === 'student')
        // return { name: 'access-control' }
        return { name: 'dashboards-academy' }
        // return { name: 'dashboards-lms-student' }
      if (userRole === 'instructor')
        return { name: 'dashboards-lms-instructor' }

      return { name: 'login', query: to.query }
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
]

export const routes: RouteRecordRaw[] = [
  // Email filter
  {
    path: '/apps/email/filter/:filter',
    name: 'apps-email-filter',
    component: emailRouteComponent,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },

  // Email label
  {
    path: '/apps/email/label/:label',
    name: 'apps-email-label',
    component: emailRouteComponent,
    meta: {
      // contentClass: 'email-application',
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },

  {
    path: '/logistics/dashboards',
    name: 'dashboards-logistics',
    component: () => import('@/pages/apps/logistics/dashboard.vue'),
  },
  {
    path: '/academy/dashboard',
    name: 'dashboards-academy',
    component: () => import('@/pages/apps/academy/dashboard.vue'),
  },
  {
    path: '/academy/my-courses',
    name: 'all-courses',
    component: () => import('@/pages/apps/academy/my-course.vue'),
  },
  {
    path: '/academy/course-details/:courseId',
    name: 'course-details',
    component: () => import('@/pages/apps/academy/course-details.vue'),
  },
  {
    path: '/apps/ecommerce/dashboard',
    name: 'apps-ecommerce-dashboard',
    component: () => import('@/pages/dashboards/ecommerce.vue'),
  },
  // {
  //   path: '/academy/dashboard',
  //   name: 'academy-dashboard',
  //   component: () => import('@/pages/apps/academy/dashboard.vue'),
  // },
  // {
  //   path: '/register',
  //   name: 'register',
  //   component: () => import('@/pages/register.vue'),
  //   meta: {
  //     disable: true, // Add this property
  //     public: false,
  //   },
  // }

  {
    path: '/apps/chat',
    name: 'apps-chat',
    component: () => import('@/pages/apps/chat.vue'),
    meta: { disable: true }
  }
]
