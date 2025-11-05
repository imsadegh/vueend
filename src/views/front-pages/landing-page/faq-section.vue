<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import sittingGirlWithLaptop from '@images/front-pages/landing-page/sitting-girl-with-laptop.png'
import sectionTitleIcon from '@images/pages/section-title-icon.png'
import frontPageElement from '@images/svg/front-page-element.svg'

const { t: $t } = useI18n()

const faqData = [
  {
    questionKey: 'landingPage.faq.question1',
    answerKey: 'landingPage.faq.answer1',
  },
  {
    questionKey: 'landingPage.faq.question2',
    answerKey: 'landingPage.faq.answer2',
  },
  {
    questionKey: 'landingPage.faq.question3',
    answerKey: 'landingPage.faq.answer3',
  },
  {
    questionKey: 'landingPage.faq.question4',
    answerKey: 'landingPage.faq.answer4',
  },
]
</script>

<template>
  <VContainer id="faq">
    <!-- 👉 Header  -->
    <div class="faq-section">
      <div class="headers d-flex justify-center flex-column align-center mt-12 mb-16">
        <Component
          :is="frontPageElement"
          class="front-page-element"
        />
        <div class="d-flex gap-x-3 mb-6">
          <img
            :src="sectionTitleIcon"
            alt="section title icon"
            height="24"
            width="25"
          >
          <div
            class="text-body-1 text-high-emphasis font-weight-medium"
            style="letter-spacing: 0.15px !important;"
          >
            {{ $t('landingPage.faq.sectionTitle') }}
          </div>
        </div>

        <div class="mb-2 text-center">
          <span class="text-h5 d-inline-block">{{ $t('landingPage.faq.heading') }}</span> <span
            class="text-h4 d-inline-block font-weight-bold"
            style="line-height: 2rem;"
          >
            {{ $t('landingPage.faq.headingSuffix') }}
          </span>
        </div>

        <p class="text-body-1 font-weight-medium text-center mb-0">
          {{ $t('landingPage.faq.description') }}
        </p>
      </div>

      <div
        class="d-flex align-center justify-space-between flex-wrap flex-md-nowrap pb-4"
        style="gap: 6.25rem;"
      >
        <VImg
          :src="sittingGirlWithLaptop"
          height="340"
          width="320"
          class="flip-in-rtl"
        />

        <div>
          <VExpansionPanels class="py-4">
            <VExpansionPanel
              v-for="(faq, index) in faqData"
              :key="index"
            >
              <VExpansionPanelTitle>
                {{ $t(faq.questionKey) }}
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                {{ $t(faq.answerKey) }}
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.faq-section {
  position: relative;
  margin-block: 5.25rem 4.25rem;
}

.front-page-element {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
}
</style>
