<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
const { t: $t } = useI18n()
const router = useRouter()
const ability = useAbility()

// TODO: Get type from backend
const userData = useCookie<any>('userData')

const logout = async () => {
  // Remove "accessToken" from cookie
  useCookie('accessToken').value = null

  // Remove "userData" from cookie
  userData.value = null

  // Redirect to login page
  await router.push('/login')

  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
  // Remove "userAbilities" from cookie
  useCookie('userAbilityRules').value = null

  // Reset ability to initial ability
  ability.update([])
}

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'ri-user-line',
    title: $t('Profile'),
    to: { name: 'apps-user-view-id', params: { id: 21 } },
  },
  // {
  //   type: 'navItem',
  //   icon: 'ri-settings-4-line',
  //   title: $t('Settings'),
  //   to: { name: 'pages-account-settings-tab', params: { tab: 'account' } },
  // },
  // {
  //   type: 'navItem',
  //   icon: 'ri-file-text-line',
  //   title: $t('Billing Plan'),
  //   to: { name: 'pages-account-settings-tab',
  //   // to: { name: 'pages-apps-user-view-21',
  //   params: { tab: 'billing-plans' } },
  //   chipsProps: { color: 'error', text: '4', size: 'small' },
  // },
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'ri-money-dollar-circle-line',
    title: $t('Pricing'),
    to: { name: 'pages-pricing' },
  },
  {
    type: 'navItem',
    icon: 'ri-question-line',
    title: $t('FAQ'),
    to: { name: 'pages-faq' },
  },
]
</script>

<template>
  <VBadge v-if="userData" dot bordered location="bottom right" offset-x="2" offset-y="2" color="success"
    class="user-profile-badge">
    <VAvatar class="cursor-pointer" size="38" :color="!(userData && userData.avatar) ? 'primary' : undefined"
      :variant="!(userData && userData.avatar) ? 'tonal' : undefined">
      <VImg v-if="userData && userData.avatar" :src="userData.avatar" />
      <VIcon v-else icon="ri-user-line" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="15px">
        <VList>
          <VListItem class="px-4">
            <div class="d-flex gap-x-2 align-center">
              <VAvatar :color="!(userData && userData.avatar) ? 'primary' : undefined"
                :variant="!(userData && userData.avatar) ? 'tonal' : undefined">
                <VImg v-if="userData && userData.avatar" :src="userData.avatar" />
                <VIcon v-else icon="ri-user-line" />
              </VAvatar>

              <div>
                <div class="text-body-2 font-weight-medium text-high-emphasis">
                  {{ userData.full_name || userData.username }}
                </div>
                <div class="text-capitalize text-caption text-disabled">
                  {{ $t(`roles.${userData.role}`) }}
                </div>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template v-for="item in userProfileList" :key="item.title">
              <VListItem v-if="item.type === 'navItem'" :to="item.to" class="px-4">
                <template #prepend>
                  <VIcon :icon="item.icon" size="22" />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template v-if="item.chipsProps" #append>
                  <VChip v-bind="item.chipsProps" variant="elevated" />
                </template>
              </VListItem>

              <VDivider v-else class="my-1" />
            </template>

            <VListItem class="px-4">
              <VBtn block color="error" size="small" append-icon="ri-logout-box-r-line" @click="logout">
                {{ $t('Logout') }}
              </VBtn>
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style lang="scss">
.user-profile-badge {
  &.v-badge--bordered.v-badge--dot .v-badge__badge::after {
    color: rgb(var(--v-theme-background));
  }
}
</style>
