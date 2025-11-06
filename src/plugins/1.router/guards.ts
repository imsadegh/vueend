import { useCookie } from '@core/composable/useCookie'
import type { RouteNamedMap, _RouterTyped } from 'unplugin-vue-router'

export const setupGuards = (router: _RouterTyped<RouteNamedMap & { [key: string]: any }>) => {
  // 👉 router.beforeEach
  // Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
  router.beforeEach(to => {
    
    // Check if the route is marked as disabled
    if (to.meta.disable) {
      return {
        name: '[...error]', // Redirect to a 'not found' or alternative route
      }
    }

    // Redirect authenticated users from landing page to their dashboard
    if (to.path === '/' && to.meta.public) {
      try {
        const userData = useCookie('userData')
        if (userData.value) {
          const user = userData.value as any
          const role = user.role || user.role_id

          if (role === 'admin' || role === 5) return { name: 'dashboards-lms-admin' }
          if (role === 'instructor' || role === 2) return { name: 'dashboards-lms-instructor' }
          if (role === 'student' || role === 1 || role === 3) return { name: 'dashboards-academy' }

          return { name: 'dashboards-lms-admin' }
        }
      } catch (e) {
        // If error occurs, allow landing page to load normally
      }
    }

    /*
     * If it's a public route, continue navigation. This kind of pages are allowed to visited by login & non-login users. Basically, without any restrictions.
     * Examples of public routes are, 404, under maintenance, etc.
     */
    if (to.meta.public)
      return

    /**
     * Check if user is logged in by checking if token & user data exists in local storage
     * Feel free to update this logic to suit your needs
     */
    const isLoggedIn = !!(useCookie('userData').value && useCookie('accessToken').value)

    /*
      If user is logged in and is trying to access login like page, redirect to their dashboard
      else allow visiting the page
      (WARN: Don't allow executing further by return statement because next code will check for permissions)
     */
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn) {
        // Redirect authenticated users to their appropriate dashboard
        try {
          const userData = useCookie('userData')
          if (userData.value) {
            const user = userData.value as any
            const role = user.role || user.role_id

            if (role === 'admin' || role === 5) return { name: 'dashboards-lms-admin' }
            if (role === 'instructor' || role === 2) return { name: 'dashboards-lms-instructor' }
            if (role === 'student' || role === 1 || role === 3) return { name: 'dashboards-academy' }

            return { name: 'dashboards-lms-admin' }
          }
        } catch (e) {
          // If error occurs, redirect to landing page
        }
        // Default redirect to landing page
        return { path: '/' }
      }
      else
        return undefined
    }


    // NEW: If not logged in, redirect to the login page.
    if (!isLoggedIn) {
      return {
        name: 'login',
        query: { to: to.fullPath },
      }
    }
    // If all checks pass, allow the navigation.
    return undefined

    // if (!canNavigate(to) && to.matched.length) {
    //   /* eslint-disable indent */
    //   return isLoggedIn
    //     ? { name: 'not-authorized' }
    //     : {
    //       name: 'login',
    //       query: {
    //         ...to.query,
    //         to: to.fullPath !== '/' ? to.path : undefined,
    //       },
    //     }
    //   /* eslint-enable indent */
    // }
  })
}
