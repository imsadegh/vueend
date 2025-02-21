export default [
  {
    title: 'Dashboards',
    icon: { icon: 'ri-home-smile-line' },
    children: [
      // {
      //   title: 'CRM',
      //   to: 'dashboards-crm',
      //   icon: { icon: 'ri-computer-line' },
      // },
      {
        title: 'LMS',
        to: 'dashboards-lms-admin',
        icon: { icon: 'ri-computer-line' },
      },
      {
        title: 'Analytics',
        to: 'dashboards-analytics',
        icon: { icon: 'ri-bar-chart-line' },
      },
      // {
      //   title: 'eCommerce',
      //   to: 'dashboards-ecommerce',
      //   icon: { icon: 'ri-shopping-cart-2-line' },
      // },
      {
        title: 'Academy',
        to: 'dashboards-academy',
        icon: { icon: 'ri-book-open-line' },
      },
      // TODO - add it into vertical menu too
      {
        title: 'Student Dashboard',
        to: 'dashboards-academy',
        icon: { icon: 'ri-book-open-line' },
        action: 'read',
        subject: 'AclDemo',
      },
      // TODO - add it into vertical menu too
      {
        title: 'Instructor Dashboard',
        to: 'dashboards-lms-instructor',
        icon: { icon: 'ri-book-open-line' },
        action: 'manage',
        subject: 'Course',
      },

      // {
      //   title: 'Logistics',
      //   to: 'dashboards-logistics',
      //   icon: { icon: 'ri-truck-line' },
      // },
    ],
  },

]
