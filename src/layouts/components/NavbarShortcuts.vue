<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const shortcuts = [
  // {
  //   icon: 'ri-calendar-line',
  //   title: 'Calendar',
  //   subtitle: 'Appointments',
  //   to: { name: 'apps-calendar' },
  // },
  // {
  //   icon: 'ri-file-list-3-line',
  //   title: 'Invoice App',
  //   subtitle: 'Manage Accounts',
  //   to: { name: 'apps-invoice-list' },
  // },
  {
    icon: 'ri-user-line',
    title: $t('Users'),
    subtitle: $t('Manage Users'),
    to: { name: 'apps-user-list' },
    },
    {
    icon: 'ri-computer-line',
    title: $t('Role Management'),
    subtitle: $t('Permissions'),
    to: { name: 'apps-roles' },
    },
    {
    icon: 'ri-pie-chart-2-line',
    title: $t('Dashboard'),
    subtitle: $t('User Dashboard'),
    to: { name: 'dashboards-analytics' },
    },
    {
    icon: 'ri-settings-4-line',
    title: $t('Settings'),
    subtitle: $t('Account Settings'),
    to: { name: 'pages-account-settings-tab', params: { tab: 'account' } },
  },

]
</script>

<template>
  <Shortcuts :shortcuts="shortcuts" />
</template>
