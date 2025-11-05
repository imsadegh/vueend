<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import sectionTitleIcon from '@images/pages/section-title-icon.png'
import frontPageVectorImg from '@images/svg/front-page-vector.svg'
import ListArrowIcon from '@images/svg/list-arrow-icon.svg'
import VectorIcon from '@images/svg/vector.svg'

const { t: $t } = useI18n()

const pricingPlans = [
  {
    titleKey: 'landingPage.pricing.basicPlan',
    title: 'Basic Plan',
    price: 20,
    features: [
      'Timeline',
      'Basic search',
      'Live chat widget',
      'Email marketing',
      'Custom Forms',
      'Traffic analytics',
    ],
    supportTypeKey: 'landingPage.pricing.basicSupport',
    supportMediumKey: 'landingPage.pricing.onlyEmail',
    respondTimeKey: 'landingPage.pricing.avgTime24h',
    current: false,
  },
  {
    titleKey: 'landingPage.pricing.favoritePlan',
    title: 'Favourite Plan',
    price: 51,
    features: [
      'Everything in basic',
      'Timeline with database',
      'Advanced search',
      'Marketing automation',
      'Advanced chatbot',
      'Campaign management',
    ],
    supportTypeKey: 'landingPage.pricing.standardSupport',
    supportMediumKey: 'landingPage.pricing.emailAndChat',
    respondTimeKey: 'landingPage.pricing.avgTime6h',
    current: true,
  },
  {
    titleKey: 'landingPage.pricing.standardPlan',
    title: 'Standard Plan',
    price: 99,
    features: [
      'Campaign management',
      'Timeline with database',
      'Fuzzy search',
      'A/B testing sanbox',
      'Custom permissions',
      'Social media automation',
    ],
    supportTypeKey: 'landingPage.pricing.exclusiveSupport',
    supportMediumKey: 'landingPage.pricing.fullSupport',
    respondTimeKey: 'landingPage.pricing.liveSupport',
    current: false,
  },
]
</script>

<template>
  <VContainer id="pricing-plan">
    <div class="pricing-plans d-flex flex-column gap-12">
      <!-- 👉 Headers  -->
      <div class="headers d-flex justify-center flex-column align-center">
        <Component
          :is="frontPageVectorImg"
          class="front-page-vector"
        />

        <div class="d-flex gap-x-3 mb-6">
          <img
            :src="sectionTitleIcon"
            alt="section title icon"
            height="24"
            width="25"
          >
          <div class="text-body-1 text-high-emphasis font-weight-medium">
            {{ $t('landingPage.pricing.sectionTitle') }}
          </div>
        </div>

        <div class="mb-2 text-center">
          <span
            class="text-h4 d-inline-block font-weight-bold"
            style="line-height: 2rem;"
          >
            {{ $t('landingPage.pricing.heading') }}
          </span> <span class="text-h5 d-inline-block">{{ $t('landingPage.pricing.headingSuffix') }}</span>
        </div>

        <p class="text-body-1 font-weight-medium text-center mb-0">
          {{ $t('landingPage.pricing.description') }}
        </p>
      </div>

      <div class="w-75 mx-auto">
        <VSlider
          model-value="458+"
          max="1249"
          color="primary"
          thumb-label="always"
          class="mt-1"
        />
      </div>

      <VRow>
        <VCol
          v-for="(plan, index) in pricingPlans"
          :key="index"
        >
          <VCard
            flat
            border
            :style="plan.current ? 'border:2px solid rgb(var(--v-theme-primary))' : ''"
          >
            <VCardText class="pa-lg-8 text-no-wrap">
              <div class="d-flex flex-column gap-y-8">
                <div class="d-flex flex-column  gap-y-3">
                  <h4 class="text-h4 text-center">
                    {{ $t(plan.titleKey) }}
                  </h4>

                  <div class="d-flex align-center gap-x-3">
                    <div class="d-flex">
                      <h5
                        class="text-h5"
                        style="margin-block-start: 0.35rem;"
                      >
                        $
                      </h5>
                      <div class="plan-price-text">
                        {{ plan.price }}
                      </div>
                    </div>
                    <div>
                      <div class="text-body-1 font-weight-medium text-high-emphasis">
                        {{ $t('landingPage.pricing.perMonth') }}
                      </div>
                      <div class="text-body-2">
                        {{ $t('landingPage.pricing.yearlyDiscount') }}
                      </div>
                    </div>
                  </div>

                  <VectorIcon />
                </div>

                <div class="d-flex flex-column">
                  <VList class="card-list">
                    <VListItem
                      v-for="(item, i) in plan.features"
                      :key="i"
                    >
                      <template #prepend>
                        <Component
                          :is="ListArrowIcon"
                          class="me-3"
                        />
                      </template>
                      <h5 class="text-h5">
                        {{ item }}
                      </h5>
                    </VListItem>
                  </VList>

                  <VDivider class="my-4" />

                  <div class="d-flex align-center justify-space-between flex-wrap gap-2">
                    <div>
                      <div class="text-body-1 font-weight-medium text-high-emphasis mb-1">
                        {{ $t(plan.supportTypeKey) }} {{ $t('landingPage.pricing.support') }}
                      </div>
                      <div class="text-body-2">
                        {{ $t(plan.supportMediumKey) }}
                      </div>
                    </div>

                    <VChip
                      variant="tonal"
                      color="primary"
                      size="small"
                      class="font-weight-medium"
                    >
                      {{ $t(plan.respondTimeKey) }}
                    </VChip>
                  </div>
                </div>

                <VBtn
                  block
                  :variant="plan.current ? 'elevated' : 'outlined'"
                  :to="{ name: 'front-pages-payment' }"
                >
                  {{ $t('landingPage.pricing.getStarted') }}
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 12px;
}
</style>

<style lang="scss" scoped>
.plan-price-text {
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  font-size: 48px;
  font-weight: 700;
  line-height: 56px;
}

.pricing-plans {
  position: relative;
  margin-block: 5.25rem;
}

.front-page-vector {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
}
</style>
