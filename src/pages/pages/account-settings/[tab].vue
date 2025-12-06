<script lang="ts" setup>
import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue'
// import AccountSettingsBillingAndPlans from '@/views/pages/account-settings/AccountSettingsBillingAndPlans.vue'
import AccountSettingsSecurity from '@/views/pages/account-settings/AccountSettingsSecurity.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute('pages-account-settings-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = computed(() => [
  { title: t('accountSettings.account'), icon: 'ri-user-line', tab: 'account' },
  { title: t('accountSettings.security'), icon: 'ri-lock-line', tab: 'security' },
  // { title: t('accountSettings.billingPlans'), icon: 'ri-bookmark-line', tab: 'billing-plans' },
])

definePage({
  meta: {
    navActiveLink: 'pages-account-settings-tab',
  },
})
</script>

<template>
  <div>
    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab"
        :to="{ name: 'pages-account-settings-tab', params: { tab: item.tab } }">
        <VIcon start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-6 disable-tab-transition" :touch="false">
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>

      <!-- Billing & Plans -->
      <!-- <VWindowItem value="billing-plans">
        <AccountSettingsBillingAndPlans />
      </VWindowItem> -->
    </VWindow>
  </div>
</template>
