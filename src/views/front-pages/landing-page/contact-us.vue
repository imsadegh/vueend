<script setup lang="ts">
import sectionTitleIcon from '@images/pages/section-title-icon.png'
import frontPageVectorImg from '@images/svg/front-page-vector.svg'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const name = ref('')
const email = ref('')
const message = ref('')
</script>

<template>
  <VContainer id="contact-us">
    <!-- 👉 Headers  -->
    <div class="contact-us-section">
      <div class="headers d-flex justify-center flex-column align-center pb-15">
        <Component :is="frontPageVectorImg" class="front-page-vector" />
        <div class="d-flex gap-x-3 mb-6">
          <img :src="sectionTitleIcon" alt="section title icon" height="24" width="25">
          <div class="text-body-1 text-high-emphasis font-weight-medium">
            {{ $t('landingPage.contact.sectionTitle') }}
          </div>
        </div>

        <div class="mb-2 text-center">
          <span class="text-h4 d-inline-block font-weight-bold" style="line-height: 2rem;">
            {{ $t('landingPage.contact.heading') }}
          </span>
          <!-- <span class="text-h5 d-inline-block">{{ $t('landingPage.contact.headingSuffix') }}</span> -->
        </div>

        <p class="text-body-1 font-weight-medium text-center mb-0">
          {{ $t('landingPage.contact.description') }}
        </p>
      </div>
      <div class="mb-15">
        <VRow class="match-height">
          <VCol cols="12" md="4" sm="6">
            <VCard flat elevation="0" color="primary" theme="dark">
              <VCardText class="pa-8">
                <!-- <h6 class="text-h6 mb-1">
                  {{ $t('landingPage.contact.infoTitle') }}
                </h6> -->

                <h4 class="text-h4">
                  {{ $t('landingPage.contact.infoHeading') }}
                </h4>

                <!-- <VImg :src="ConnectImg" class="my-5" /> -->

                <div class="text-body-1">
                  {{ $t('landingPage.contact.infoDescription') }}
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="12" md="8" sm="6">
            <VCard>
              <VCardText>
                <div class="text-h5 mb-5">
                  {{ $t('landingPage.contact.formTitle') }}
                </div>
                <VForm @submit.prevent="() => { }">
                  <VRow>
                    <VCol cols="12" md="6">
                      <VTextField v-model="name" :placeholder="$t('landingPage.contact.fullNamePlaceholder')"
                        :label="$t('landingPage.contact.fullNameLabel')" />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VTextField v-model="email" :placeholder="$t('landingPage.contact.emailPlaceholder')"
                        :label="$t('landingPage.contact.emailLabel')" />
                    </VCol>

                    <VCol cols="12">
                      <VTextarea v-model="message" :placeholder="$t('landingPage.contact.messagePlaceholder')"
                        :label="$t('landingPage.contact.messageLabel')" />
                    </VCol>

                    <VCol>
                      <VBtn type="submit">
                        {{ $t('landingPage.contact.sendButton') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                </VForm>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.contact-us-section {
  position: relative;
  margin-block: 5.25rem;
}

.front-page-vector {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
}
</style>
