<script setup lang="ts">
import trophy from '@images/cards/trophy.png';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n()

// TODO: Get type from backend
const userData = useCookie<any>('userData')

function getLocalizedRole(role: string) {
  return $t(`roles.${role}`) || role;
}
</script>

<template>
  <VCard class="position-relative">
    <VCardText>
      <div class="mb-3">
        <h5 class="text-h5 text-wrap">
          {{
            $t('lms.welcome', { role: getLocalizedRole(userData.role) })
          }}
          <strong>{{ userData.first_name }}</strong> 
          <span class="text-high-emphasis"> 🎉</span>
        </h5>

        <div class="text-subtitle-1">
          <!-- Best seller of the month -->
        </div>
      </div>
      <h4 class="text-h4 text-primary">
        <!-- $42.8k -->
      </h4>
      <div class="text-body-1 mb-3">
        <!-- 78% of target <span class="text-high-emphasis">🚀</span> -->
      </div>
      <!-- <VBtn size="small">
        View Sales
      </VBtn> -->
    </VCardText>

    <!-- Trophy -->
    <VImg
      :src="trophy"
      class="trophy flip-in-rtl"
    />
  </VCard>
</template>

<style lang="scss">
.v-card .triangle-bg {
  position: absolute;
  inline-size: 10.375rem;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.v-card .trophy {
  position: absolute;
  inline-size: 6.625rem;
  inset-block-end: 0;
  inset-inline-end: 1.25rem;
}
</style>
