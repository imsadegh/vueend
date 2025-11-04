<script setup lang="ts">
import { API_BASE_URL, persianTitle } from '@/config/config';
import { themeConfig } from '@themeConfig';
import axios from 'axios';
import { VForm } from 'vuetify/components/VForm';

import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png';
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png';
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png';
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png';
import authV2LoginMaskDark from '@images/pages/auth-v2-login-mask-dark.png';
import authV2LoginMaskLight from '@images/pages/auth-v2-login-mask-light.png';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true)

const authThemeMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)

// TODO use the numberphone as login
// TODO - use vuetify snackbar to show the error messages.
// TODO - use the standard valdiator that is made by vuetify,
// TODO - users must login with the phone number instead of the email.

const route = useRoute()
const router = useRouter()
const { t: $t } = useI18n()
const requiredValidator = (v: string) => !!v || $t('This field is required')
const phoneValidator = (v: string) => /^09\d{9}$/.test(v) || $t('Invalid phone number format')

const ability = useAbility()

const errors = ref<Record<string, string | undefined>>({
  phone_number: undefined,
  password: undefined,
})

const refVForm = ref<VForm>()

const credentials = ref({
  phone_number: '',  // Format: 09XXXXXXXXX
  password: '',
})

const rememberMe = ref(false)

// const login = async () => {
//   try {
//     const res = await $api('/auth/login', {
//       method: 'POST',
//       body: {
//         email: credentials.value.email,
//         password: credentials.value.password,
//       },
//       onResponseError({ response }) {
//         errors.value = response._data.errors
//       },
//     })

//     // console.log('Login successful:', res)

//     const { accessToken, userData, userAbilityRules } = res

//     useCookie('userAbilityRules').value = userAbilityRules
//     ability.update(userAbilityRules)

//     useCookie('userData').value = userData
//     useCookie('accessToken').value = accessToken

//     console.log('accessToken:', accessToken)
//     console.log('userAbilityRules:', userAbilityRules)
//     console.log('userData:', userData)

//     // Redirect to `to` query if exist or redirect to index route
//     // ❗ nextTick is required to wait for DOM updates and later redirect
//     await nextTick(() => {
//       router.replace(route.query.to ? String(route.query.to) : '/')
//     })
//   }
//   catch (err) {
//     console.error(err)
//   }
// }

const login = async () => {
  try {
    // Send login request to the backend using phone_number and password
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      phone_number: credentials.value.phone_number,
      password: credentials.value.password,
    })

    // Extract data from the API response
    const { accessToken, userData, userAbilityRules } = response.data

    // Validate response contains required fields
    if (!accessToken || !userData) {
      throw new Error('Invalid response: missing accessToken or userData')
    }

    // Save user data and token in cookies
    useCookie('userAbilityRules').value = userAbilityRules || []
    // Update ability rules in the application
    ability.update(userAbilityRules || [])

    useCookie('userData').value = userData
    useCookie('accessToken').value = accessToken

    // Redirect the user to the intended route or homepage
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
  } catch (error: any) {
    console.error('Login failed:', error)

    const response = error?.response

    // Handle different error scenarios
    if (response?.status === 419) {
      alert('Session expired. Please refresh and try again.')
    } else if (response?.status === 422) {
      // Validation errors
      errors.value = response?.data?.errors || {}
      alert('Please check your input and try again.')
    } else if (response?.status === 401) {
      // Invalid credentials
      alert('Invalid phone number or password.')
    } else if (response?.status === 500) {
      // Server error
      console.error('Server error response:', response?.data)
      alert('Server error. Please try again later.')
    } else {
      // Network or other errors
      const message = response?.data?.message || error?.message || 'Login failed. Please try again.'
      alert(message)
    }
  }
}

const onSubmit = () => {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        login()
    })
}
</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo app-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="app-logo-title">
        <!-- {{ themeConfig.app.title }} -->
        {{ persianTitle }}
      </h1>
    </div>
  </RouterLink>

  <VRow no-gutters class="auth-wrapper">
    <VCol md="8" class="d-none d-md-flex align-center justify-center position-relative">
      <div class="d-flex align-center justify-center pa-10">
        <img :src="authThemeImg" class="auth-illustration w-100" alt="auth-illustration">
      </div>
      <VImg :src="authThemeMask" class="d-none d-md-flex auth-footer-mask" alt="auth-mask" />
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-5 pa-lg-7">
        <VCardText>
          <h4 class="text-h4 mb-1">
            {{ $t('Welcome to ') }}
            <!-- <span class="text-capitalize">{{ themeConfig.app.title }}!</span> 👋🏻 -->
          </h4>
          <p class="mb-0">
            {{ $t('Please sign-in to your account and start the adventure') }}
          </p>
        </VCardText>
        <VCardText>
          <VAlert color="primary" variant="tonal">
            <p class="text-caption mb-0 text-primary">
              {{ $t('Login with phone number and password') }}
            </p>
          </VAlert>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- phone number -->
              <VCol cols="12">
                <VTextField
                  v-model="credentials.phone_number"
                  :label="$t('Phone Number')"
                  placeholder="09121234567"
                  type="tel"
                  autofocus
                  :rules="[requiredValidator, phoneValidator]"
                  :error-messages="errors.phone_number"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField v-model="credentials.password" :label="$t('Password')" placeholder="············"
                  :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="d-flex align-center flex-wrap justify-space-between my-6 gap-x-2">
                  <VCheckbox v-model="rememberMe" :label="$t('Remember me')" />
                  <RouterLink class="text-primary" :to="{ name: 'forgot-password' }">
                    {{ $t('Forgot Password?') }}
                  </RouterLink>
                </div>

                <VBtn block type="submit">
                  {{ $t('Login') }}
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-body-1 text-center">
                <span class="d-inline-block">
                  {{ $t('New on our platform?') }}
                </span>
                <RouterLink class="text-primary ms-1 d-inline-block text-body-1" :to="{ name: 'register' }">
                  {{ $t('Create an account') }}
                </RouterLink>
              </VCol>

              <!-- <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4 text-high-emphasis">or</span>
                <VDivider />
              </VCol>

              auth providers
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol> -->
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
