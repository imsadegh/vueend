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
      If user is logged in and is trying to access login like page, redirect to home
      else allow visiting the page
      (WARN: Don't allow executing further by return statement because next code will check for permissions)
     */
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn)
        return '/'
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
