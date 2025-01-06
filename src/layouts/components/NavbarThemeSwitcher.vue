<script setup lang="ts">
import type { ThemeSwitcherTheme } from '@layouts/types';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n()

const themes: ThemeSwitcherTheme[] = [
  {
    name: 'system',
    icon: 'ri-macbook-line',
  },
  {
    name: 'light',
    icon: 'ri-sun-line',
  },
  {
    name: 'dark',
    icon: 'ri-moon-clear-line',
  },
]
</script>

<template>
  <ThemeSwitcher :themes="themes" />
</template>
