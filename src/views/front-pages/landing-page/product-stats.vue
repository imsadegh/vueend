<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const statData = ref([
  { titleKey: 'landingPage.stats.stat1Title', value: 137, icon: 'ri-layout-line', color: 'primary', isHover: false },
  { titleKey: 'landingPage.stats.stat2Title', value: 1100, icon: 'ri-time-line', color: 'success', isHover: false },
  { titleKey: 'landingPage.stats.stat3Title', value: 137, icon: 'ri-user-smile-line', color: 'warning', isHover: false },
  { titleKey: 'landingPage.stats.stat4Title', value: 23, icon: 'ri-award-line', color: 'info', isHover: false },
])
</script>

<template>
  <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
    <VContainer>
      <div class="py-12">
        <VRow>
          <VCol
            v-for="(product, index) in statData"
            :key="index"
          >
            <VCard flat>
              <VCardText class="text-center">
                <VAvatar
                  size="82"
                  :color="product.color"
                  :variant="product.isHover ? 'elevated' : 'tonal'"
                  class="mb-6 cursor-pointer"
                  @mouseenter="() => product.isHover = true"
                  @mouseleave="product.isHover = false"
                >
                  <VIcon
                    :icon="product.icon"
                    size="42"
                  />
                </VAvatar>
                <div class="product-stat-text">
                  {{ $t(product.titleKey.replace('Title', 'Value')) }}+
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ $t(product.titleKey) }}
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.product-stat-text {
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.25px;
  line-height: 42px;
}
</style>
