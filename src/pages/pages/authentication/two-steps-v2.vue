<script setup lang="ts">
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import authV2RegisterMaskDark from '@images/pages/auth-v2-register-mask-dark.png'
import authV2RegisterMaskLight from '@images/pages/auth-v2-register-mask-light.png'
import authV2TwoStepsIllustrationBorderedDark from '@images/pages/auth-v2-two-steps-illustration-bordered-dark.png'
import authV2TwoStepsIllustrationBorderedLight from '@images/pages/auth-v2-two-steps-illustration-bordered-light.png'
import authV2TwoStepsIllustrationDark from '@images/pages/auth-v2-two-steps-illustration-dark.png'
import authV2TwoStepsIllustrationLight from '@images/pages/auth-v2-two-steps-illustration-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const authV2ThemeTwoStepMask = useGenerateImageVariant(authV2RegisterMaskLight, authV2RegisterMaskDark)
const authV2TwoStepsIllustration = useGenerateImageVariant (authV2TwoStepsIllustrationLight, authV2TwoStepsIllustrationDark, authV2TwoStepsIllustrationBorderedLight, authV2TwoStepsIllustrationBorderedDark, true)

import { API_BASE_URL, persianTitle } from '@/config/config'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const otp = ref('')
const isOtpInserted = ref(false)
const route = useRoute()
const { t: $t } = useI18n()

const onFinish = async () => {
  isOtpInserted.value = true

  // setTimeout(() => {
  //   isOtpInserted.value = false
  //   router.push('/')
  // }, 2000)
  await verifyOTP()

  isOtpInserted.value = false
}

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

// todo use global validator
// todo convert persian number to english
const verifyOTP = async () => {
  try {
    const phone_number = route.query.phone_number // Retrieve phone number from query params

    const response = await axios.post(`${API_BASE_URL}/otp/verify`, {
      phone_number,
      otp: otp.value,
    })

    alert($t('Account verified successfully!'))
    router.push('/')
  } catch (error) {
    console.error('Error verifying OTP:', error)
    alert($t('Invalid OTP. Please try again.'))
  }
}

const convertToPersian = (number: string) => {
              const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
              return number.replace(/\d/g, (digit: string) => persianDigits[parseInt(digit)]);
            };

</script>

<template>
  <RouterLink to="/">
    <div class="app-logo auth-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="app-logo-title">
        <!-- {{ themeConfig.app.title }} -->
        {{ persianTitle }}
      </h1>
    </div>
  </RouterLink>

  <VRow
    class="auth-wrapper"
    no-gutters
  >
    <VCol
      md="8"
      class="d-none d-md-flex align-center justify-center position-relative"
    >
      <!-- Here your illustrator -->
      <div class="d-flex align-center justify-center pa-10">
        <img
          :src="authV2TwoStepsIllustration"
          class="auth-illustration w-100"
          alt="auth-illustration"
        >
      </div>
      <VImg
        :src="authV2ThemeTwoStepMask"
        class="d-none d-md-flex auth-footer-mask"
        alt="auth-mask"
      />
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-5 pa-lg-7"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            {{ $t ('Two Step Verification 💬')}}
          </h4>
          <p class="mb-1">
            {{$t ('We sent a verification code to your mobile. Enter the code from the mobile in the field below.')}}
          </p>
            <h6 class="text-h6">
            ارسال به: {{ convertToPersian(route.query.phone_number as string || '') }}
            </h6>
        </VCardText>

        <VCardText>
          <!-- <VForm @submit.prevent="() => {}"> -->
          <VForm @submit.prevent="onFinish">
            <!-- email -->
            <h6 class="text-body-1">
              {{$t ('Type your 6 digit security code')}}
            </h6>
            <VOtpInput
              v-model="otp"
              :disabled="isOtpInserted"
              type="number"
              autofocus
              class="pa-0"
              @finish="onFinish"
            />

            <!-- reset password -->
            <VBtn
              :loading="isOtpInserted"
              :disabled="isOtpInserted"
              block
              type="submit"
              class="mt-3 mb-5"
            >
              {{$t ('Verify my account')}}
            </VBtn>

            <!-- Todo write the api backend -->
            <!-- back to login -->
            <div class="d-flex justify-center align-center flex-wrap">
              <span class="me-1">
                {{$t("Didn't get the code?")}}
                </span>
              <a href="#">{{$t('Resend')}}</a>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.v-otp-input {
  .v-otp-input__content {
    direction: ltr;
    padding-inline: 0;
    text-align: start;
  }
}
</style>
