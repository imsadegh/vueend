/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '$error': RouteRecordInfo<'$error', '/:error(.*)', { error: ParamValue<true> }, { error: ParamValue<false> }>,
    'access-control': RouteRecordInfo<'access-control', '/access-control', Record<never, never>, Record<never, never>>,
    'apps-academy-course-details': RouteRecordInfo<'apps-academy-course-details', '/apps/academy/course-details', Record<never, never>, Record<never, never>>,
    'apps-academy-dashboard': RouteRecordInfo<'apps-academy-dashboard', '/apps/academy/dashboard', Record<never, never>, Record<never, never>>,
    'apps-academy-my-course': RouteRecordInfo<'apps-academy-my-course', '/apps/academy/my-course', Record<never, never>, Record<never, never>>,
    'apps-calendar': RouteRecordInfo<'apps-calendar', '/apps/calendar', Record<never, never>, Record<never, never>>,
    'apps-chat': RouteRecordInfo<'apps-chat', '/apps/chat', Record<never, never>, Record<never, never>>,
    'apps-ecommerce-customer-details-id': RouteRecordInfo<'apps-ecommerce-customer-details-id', '/apps/ecommerce/customer/details/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'apps-ecommerce-customer-list': RouteRecordInfo<'apps-ecommerce-customer-list', '/apps/ecommerce/customer/list', Record<never, never>, Record<never, never>>,
    'apps-ecommerce-manage-review': RouteRecordInfo<'apps-ecommerce-manage-review', '/apps/ecommerce/manage-review', Record<never, never>, Record<never, never>>,
    'apps-ecommerce-order-details-id': RouteRecordInfo<'apps-ecommerce-order-details-id', '/apps/ecommerce/order/details/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'apps-ecommerce-order-list': RouteRecordInfo<'apps-ecommerce-order-list', '/apps/ecommerce/order/list', Record<never, never>, Record<never, never>>,
    'apps-ecommerce-product-add': RouteRecordInfo<'apps-ecommerce-product-add', '/apps/ecommerce/product/add', Record<never, never>, Record<never, never>>,
    'apps-ecommerce-product-category-list': RouteRecordInfo<'apps-ecommerce-product-category-list', '/apps/ecommerce/product/category-list', Record<never, never>, Record<never, never>>,
    'apps-ecommerce-product-list': RouteRecordInfo<'apps-ecommerce-product-list', '/apps/ecommerce/product/list', Record<never, never>, Record<never, never>>,
    'apps-ecommerce-referrals': RouteRecordInfo<'apps-ecommerce-referrals', '/apps/ecommerce/referrals', Record<never, never>, Record<never, never>>,
    'apps-ecommerce-settings': RouteRecordInfo<'apps-ecommerce-settings', '/apps/ecommerce/settings', Record<never, never>, Record<never, never>>,
    'apps-email': RouteRecordInfo<'apps-email', '/apps/email', Record<never, never>, Record<never, never>>,
    'apps-invoice-add': RouteRecordInfo<'apps-invoice-add', '/apps/invoice/add', Record<never, never>, Record<never, never>>,
    'apps-invoice-edit-id': RouteRecordInfo<'apps-invoice-edit-id', '/apps/invoice/edit/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'apps-invoice-list': RouteRecordInfo<'apps-invoice-list', '/apps/invoice/list', Record<never, never>, Record<never, never>>,
    'apps-invoice-preview-id': RouteRecordInfo<'apps-invoice-preview-id', '/apps/invoice/preview/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'apps-kanban': RouteRecordInfo<'apps-kanban', '/apps/kanban', Record<never, never>, Record<never, never>>,
    'apps-logistics-dashboard': RouteRecordInfo<'apps-logistics-dashboard', '/apps/logistics/dashboard', Record<never, never>, Record<never, never>>,
    'apps-logistics-fleet': RouteRecordInfo<'apps-logistics-fleet', '/apps/logistics/fleet', Record<never, never>, Record<never, never>>,
    'apps-permissions': RouteRecordInfo<'apps-permissions', '/apps/permissions', Record<never, never>, Record<never, never>>,
    'apps-roles': RouteRecordInfo<'apps-roles', '/apps/roles', Record<never, never>, Record<never, never>>,
    'apps-user-list': RouteRecordInfo<'apps-user-list', '/apps/user/list', Record<never, never>, Record<never, never>>,
    'apps-user-view-id': RouteRecordInfo<'apps-user-view-id', '/apps/user/view/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'apps-email-filter': RouteRecordInfo<'apps-email-filter', '/apps/email/:filter', { filter: ParamValue<true> }, { filter: ParamValue<false> }>,
    'apps-email-label': RouteRecordInfo<'apps-email-label', '/apps/email/:label', { label: ParamValue<true> }, { label: ParamValue<false> }>,
    'charts-apex-chart': RouteRecordInfo<'charts-apex-chart', '/charts/apex-chart', Record<never, never>, Record<never, never>>,
    'charts-chartjs': RouteRecordInfo<'charts-chartjs', '/charts/chartjs', Record<never, never>, Record<never, never>>,
    'components-alert': RouteRecordInfo<'components-alert', '/components/alert', Record<never, never>, Record<never, never>>,
    'components-avatar': RouteRecordInfo<'components-avatar', '/components/avatar', Record<never, never>, Record<never, never>>,
    'components-badge': RouteRecordInfo<'components-badge', '/components/badge', Record<never, never>, Record<never, never>>,
    'components-button': RouteRecordInfo<'components-button', '/components/button', Record<never, never>, Record<never, never>>,
    'components-chip': RouteRecordInfo<'components-chip', '/components/chip', Record<never, never>, Record<never, never>>,
    'components-dialog': RouteRecordInfo<'components-dialog', '/components/dialog', Record<never, never>, Record<never, never>>,
    'components-expansion-panel': RouteRecordInfo<'components-expansion-panel', '/components/expansion-panel', Record<never, never>, Record<never, never>>,
    'components-list': RouteRecordInfo<'components-list', '/components/list', Record<never, never>, Record<never, never>>,
    'components-menu': RouteRecordInfo<'components-menu', '/components/menu', Record<never, never>, Record<never, never>>,
    'components-pagination': RouteRecordInfo<'components-pagination', '/components/pagination', Record<never, never>, Record<never, never>>,
    'components-progress-circular': RouteRecordInfo<'components-progress-circular', '/components/progress-circular', Record<never, never>, Record<never, never>>,
    'components-progress-linear': RouteRecordInfo<'components-progress-linear', '/components/progress-linear', Record<never, never>, Record<never, never>>,
    'components-snackbar': RouteRecordInfo<'components-snackbar', '/components/snackbar', Record<never, never>, Record<never, never>>,
    'components-tabs': RouteRecordInfo<'components-tabs', '/components/tabs', Record<never, never>, Record<never, never>>,
    'components-timeline': RouteRecordInfo<'components-timeline', '/components/timeline', Record<never, never>, Record<never, never>>,
    'components-tooltip': RouteRecordInfo<'components-tooltip', '/components/tooltip', Record<never, never>, Record<never, never>>,
    'dashboards-analytics': RouteRecordInfo<'dashboards-analytics', '/dashboards/analytics', Record<never, never>, Record<never, never>>,
    'dashboards-crm': RouteRecordInfo<'dashboards-crm', '/dashboards/crm', Record<never, never>, Record<never, never>>,
    'dashboards-ecommerce': RouteRecordInfo<'dashboards-ecommerce', '/dashboards/ecommerce', Record<never, never>, Record<never, never>>,
    'dashboards-lms-admin': RouteRecordInfo<'dashboards-lms-admin', '/dashboards/lms-admin', Record<never, never>, Record<never, never>>,
    'dashboards-lms-teacher': RouteRecordInfo<'dashboards-lms-teacher', '/dashboards/lms-teacher', Record<never, never>, Record<never, never>>,
    'extensions-swiper': RouteRecordInfo<'extensions-swiper', '/extensions/swiper', Record<never, never>, Record<never, never>>,
    'extensions-tour': RouteRecordInfo<'extensions-tour', '/extensions/tour', Record<never, never>, Record<never, never>>,
    'forgot-password': RouteRecordInfo<'forgot-password', '/forgot-password', Record<never, never>, Record<never, never>>,
    'forms-autocomplete': RouteRecordInfo<'forms-autocomplete', '/forms/autocomplete', Record<never, never>, Record<never, never>>,
    'forms-checkbox': RouteRecordInfo<'forms-checkbox', '/forms/checkbox', Record<never, never>, Record<never, never>>,
    'forms-combobox': RouteRecordInfo<'forms-combobox', '/forms/combobox', Record<never, never>, Record<never, never>>,
    'forms-custom-input': RouteRecordInfo<'forms-custom-input', '/forms/custom-input', Record<never, never>, Record<never, never>>,
    'forms-date-time-picker': RouteRecordInfo<'forms-date-time-picker', '/forms/date-time-picker', Record<never, never>, Record<never, never>>,
    'forms-editors': RouteRecordInfo<'forms-editors', '/forms/editors', Record<never, never>, Record<never, never>>,
    'forms-file-input': RouteRecordInfo<'forms-file-input', '/forms/file-input', Record<never, never>, Record<never, never>>,
    'forms-form-layouts': RouteRecordInfo<'forms-form-layouts', '/forms/form-layouts', Record<never, never>, Record<never, never>>,
    'forms-form-validation': RouteRecordInfo<'forms-form-validation', '/forms/form-validation', Record<never, never>, Record<never, never>>,
    'forms-form-wizard-icons': RouteRecordInfo<'forms-form-wizard-icons', '/forms/form-wizard-icons', Record<never, never>, Record<never, never>>,
    'forms-form-wizard-numbered': RouteRecordInfo<'forms-form-wizard-numbered', '/forms/form-wizard-numbered', Record<never, never>, Record<never, never>>,
    'forms-radio': RouteRecordInfo<'forms-radio', '/forms/radio', Record<never, never>, Record<never, never>>,
    'forms-range-slider': RouteRecordInfo<'forms-range-slider', '/forms/range-slider', Record<never, never>, Record<never, never>>,
    'forms-rating': RouteRecordInfo<'forms-rating', '/forms/rating', Record<never, never>, Record<never, never>>,
    'forms-select': RouteRecordInfo<'forms-select', '/forms/select', Record<never, never>, Record<never, never>>,
    'forms-slider': RouteRecordInfo<'forms-slider', '/forms/slider', Record<never, never>, Record<never, never>>,
    'forms-switch': RouteRecordInfo<'forms-switch', '/forms/switch', Record<never, never>, Record<never, never>>,
    'forms-textarea': RouteRecordInfo<'forms-textarea', '/forms/textarea', Record<never, never>, Record<never, never>>,
    'forms-textfield': RouteRecordInfo<'forms-textfield', '/forms/textfield', Record<never, never>, Record<never, never>>,
    'front-pages-checkout': RouteRecordInfo<'front-pages-checkout', '/front-pages/checkout', Record<never, never>, Record<never, never>>,
    'front-pages-help-center': RouteRecordInfo<'front-pages-help-center', '/front-pages/help-center', Record<never, never>, Record<never, never>>,
    'front-pages-help-center-article-title': RouteRecordInfo<'front-pages-help-center-article-title', '/front-pages/help-center/article/:title', { title: ParamValue<true> }, { title: ParamValue<false> }>,
    'front-pages-landing-page': RouteRecordInfo<'front-pages-landing-page', '/front-pages/landing-page', Record<never, never>, Record<never, never>>,
    'front-pages-payment': RouteRecordInfo<'front-pages-payment', '/front-pages/payment', Record<never, never>, Record<never, never>>,
    'front-pages-pricing': RouteRecordInfo<'front-pages-pricing', '/front-pages/pricing', Record<never, never>, Record<never, never>>,
    'login': RouteRecordInfo<'login', '/login', Record<never, never>, Record<never, never>>,
    'not-authorized': RouteRecordInfo<'not-authorized', '/not-authorized', Record<never, never>, Record<never, never>>,
    'pages-account-settings-tab': RouteRecordInfo<'pages-account-settings-tab', '/pages/account-settings/:tab', { tab: ParamValue<true> }, { tab: ParamValue<false> }>,
    'pages-authentication-forgot-password-v1': RouteRecordInfo<'pages-authentication-forgot-password-v1', '/pages/authentication/forgot-password-v1', Record<never, never>, Record<never, never>>,
    'pages-authentication-forgot-password-v2': RouteRecordInfo<'pages-authentication-forgot-password-v2', '/pages/authentication/forgot-password-v2', Record<never, never>, Record<never, never>>,
    'pages-authentication-login-v1': RouteRecordInfo<'pages-authentication-login-v1', '/pages/authentication/login-v1', Record<never, never>, Record<never, never>>,
    'pages-authentication-login-v2': RouteRecordInfo<'pages-authentication-login-v2', '/pages/authentication/login-v2', Record<never, never>, Record<never, never>>,
    'pages-authentication-register-multi-steps': RouteRecordInfo<'pages-authentication-register-multi-steps', '/pages/authentication/register-multi-steps', Record<never, never>, Record<never, never>>,
    'pages-authentication-register-v1': RouteRecordInfo<'pages-authentication-register-v1', '/pages/authentication/register-v1', Record<never, never>, Record<never, never>>,
    'pages-authentication-register-v2': RouteRecordInfo<'pages-authentication-register-v2', '/pages/authentication/register-v2', Record<never, never>, Record<never, never>>,
    'pages-authentication-reset-password-v1': RouteRecordInfo<'pages-authentication-reset-password-v1', '/pages/authentication/reset-password-v1', Record<never, never>, Record<never, never>>,
    'pages-authentication-reset-password-v2': RouteRecordInfo<'pages-authentication-reset-password-v2', '/pages/authentication/reset-password-v2', Record<never, never>, Record<never, never>>,
    'pages-authentication-two-steps-v1': RouteRecordInfo<'pages-authentication-two-steps-v1', '/pages/authentication/two-steps-v1', Record<never, never>, Record<never, never>>,
    'pages-authentication-two-steps-v2': RouteRecordInfo<'pages-authentication-two-steps-v2', '/pages/authentication/two-steps-v2', Record<never, never>, Record<never, never>>,
    'pages-authentication-verify-email-v1': RouteRecordInfo<'pages-authentication-verify-email-v1', '/pages/authentication/verify-email-v1', Record<never, never>, Record<never, never>>,
    'pages-authentication-verify-email-v2': RouteRecordInfo<'pages-authentication-verify-email-v2', '/pages/authentication/verify-email-v2', Record<never, never>, Record<never, never>>,
    'pages-cards-card-actions': RouteRecordInfo<'pages-cards-card-actions', '/pages/cards/card-actions', Record<never, never>, Record<never, never>>,
    'pages-cards-card-advance': RouteRecordInfo<'pages-cards-card-advance', '/pages/cards/card-advance', Record<never, never>, Record<never, never>>,
    'pages-cards-card-basic': RouteRecordInfo<'pages-cards-card-basic', '/pages/cards/card-basic', Record<never, never>, Record<never, never>>,
    'pages-cards-card-gamification': RouteRecordInfo<'pages-cards-card-gamification', '/pages/cards/card-gamification', Record<never, never>, Record<never, never>>,
    'pages-cards-card-statistics': RouteRecordInfo<'pages-cards-card-statistics', '/pages/cards/card-statistics', Record<never, never>, Record<never, never>>,
    'pages-cards-card-widgets': RouteRecordInfo<'pages-cards-card-widgets', '/pages/cards/card-widgets', Record<never, never>, Record<never, never>>,
    'pages-dialog-examples': RouteRecordInfo<'pages-dialog-examples', '/pages/dialog-examples', Record<never, never>, Record<never, never>>,
    'pages-faq': RouteRecordInfo<'pages-faq', '/pages/faq', Record<never, never>, Record<never, never>>,
    'pages-icons': RouteRecordInfo<'pages-icons', '/pages/icons', Record<never, never>, Record<never, never>>,
    'pages-misc-coming-soon': RouteRecordInfo<'pages-misc-coming-soon', '/pages/misc/coming-soon', Record<never, never>, Record<never, never>>,
    'pages-misc-under-maintenance': RouteRecordInfo<'pages-misc-under-maintenance', '/pages/misc/under-maintenance', Record<never, never>, Record<never, never>>,
    'pages-pricing': RouteRecordInfo<'pages-pricing', '/pages/pricing', Record<never, never>, Record<never, never>>,
    'pages-typography': RouteRecordInfo<'pages-typography', '/pages/typography', Record<never, never>, Record<never, never>>,
    'pages-user-profile-tab': RouteRecordInfo<'pages-user-profile-tab', '/pages/user-profile/:tab', { tab: ParamValue<true> }, { tab: ParamValue<false> }>,
    'register': RouteRecordInfo<'register', '/register', Record<never, never>, Record<never, never>>,
    'tables-data-table': RouteRecordInfo<'tables-data-table', '/tables/data-table', Record<never, never>, Record<never, never>>,
    'tables-simple-table': RouteRecordInfo<'tables-simple-table', '/tables/simple-table', Record<never, never>, Record<never, never>>,
    'wizard-examples-checkout': RouteRecordInfo<'wizard-examples-checkout', '/wizard-examples/checkout', Record<never, never>, Record<never, never>>,
    'wizard-examples-create-deal': RouteRecordInfo<'wizard-examples-create-deal', '/wizard-examples/create-deal', Record<never, never>, Record<never, never>>,
    'wizard-examples-property-listing': RouteRecordInfo<'wizard-examples-property-listing', '/wizard-examples/property-listing', Record<never, never>, Record<never, never>>,
  }
}
